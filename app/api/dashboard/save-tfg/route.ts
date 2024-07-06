import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink, stat } from "fs/promises";
import sharp from "sharp";
import prisma from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { MAX_BANNER_SIZE, MAX_BLOCK_IMAGE_SIZE, MAX_THUMBNAIL_SIZE, partialDefaultProjectData } from "@/app/types/defaultData";
import { TFGStatus } from "@/app/lib/enums";
import { ProjectFormData, ProjectFromDataSend } from "@/app/types/interfaces";
import { getFileType, isNullOrEmpty, roundTwoDecimals } from "@/app/utils/util";
import * as v from "valibot";
import { BLOCKSCHEMA, FormSchema } from "@/app/components/TFG_BlockDefinitions/BlockDefs";
import fs from "fs";

const USER_FOLDER_PATH = "public/assets/users/";
const DISPLAY_PATH = "/assets/users/";

interface FileToSave {
    name: string;
    blob: Blob;
    maxSize: number;
    extension: string;
}

const removePreviousFile = async (filePath: string) => {
    try {
        await stat(filePath);
        await unlink(filePath);
        return true;
    } catch (err) {
        return false;
    }
};

const saveFile = async (blob: Blob, pathFolder: string, name: string, maxSize: number, fileType: string) => {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const filepath = path.join(process.cwd(), `${pathFolder}${name}.${fileType}`);
    // Check image type and file size
    const fileTypeRegex = /image\/(jpeg|jpg|png)/;
    if (!fileTypeRegex.test(blob.type)) {
        return { success: false, error: "Invalid file type. Only images are allowed." };
    }

    if (blob.size > maxSize) {
        return { success: false, error: `File size ${name} exceeds limit of ${roundTwoDecimals(maxSize / (1024 * 1024))}MB.` };
    }

    try {
        let compressedBuffer: Buffer;
        if (fileType === "png") compressedBuffer = await sharp(buffer).png({ quality: 80 }).toBuffer();
        else compressedBuffer = await sharp(buffer).jpeg({ quality: 80 }).toBuffer();

        await writeFile(filepath, compressedBuffer);

        return true;
    } catch (error) {
        return false;
    }
};

const checkAndCreateUserFolder = (user: string) => {
    const userFolder = path.join(process.cwd(), USER_FOLDER_PATH + user);
    try {
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json("/dashboard", { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: session.user.uid },
        select: {
            personalProjectId: true,
        },
    });
    if (!user || user.personalProjectId === null) return NextResponse.json({ success: false, response: "Project doesn't exist" });

    const data = await request.formData();

    const projectDataRaw = data.get("projectData") as string | null;
    if (!projectDataRaw) {
        return NextResponse.json({ error: "No project data received." }, { status: 400 });
    }

    const filesToSave: FileToSave[] = [];
    let projectData: ProjectFromDataSend;
    try {
        //Will throw error if parse fails
        projectData = JSON.parse(projectDataRaw);
        if (projectData.banner === null) {
            const fileName = "banner";
            const blob = data.get(fileName) as Blob | null;
            if (!blob) return NextResponse.json({ succcess: false, message: `No ${fileName} image received` }, { status: 400 });
            projectData.banner = `${DISPLAY_PATH}${session.user.uid}/${fileName}.jpg`;
            filesToSave.push({ name: fileName, blob: blob, maxSize: MAX_BANNER_SIZE, extension: "jpg" });
        }
        if (projectData.thumbnail === null) {
            const fileName = "thumbnail";
            const blob = data.get(fileName) as Blob | null;
            if (!blob) return NextResponse.json({ succcess: false, message: `No ${fileName} image received` }, { status: 400 });
            projectData.thumbnail = `${DISPLAY_PATH}${session.user.uid}/${fileName}.jpg`;
            filesToSave.push({ name: fileName, blob: blob, maxSize: MAX_THUMBNAIL_SIZE, extension: "jpg" });
        }
        v.parse(FormSchema, projectData);

        for (const block of projectData.contentBlocks) {
            block.files.forEach((file, index) => {
                const fileName = `block-${block.id}-${file.id}`;
                const blob = data.get(fileName) as Blob | null;
                if (!blob) return NextResponse.json({ succcess: false, message: `No ${fileName} image received` }, { status: 400 });
                const fileType = getFileType(blob.type).toLowerCase();
                filesToSave.push({ name: fileName, blob: blob, maxSize: MAX_BLOCK_IMAGE_SIZE, extension: fileType });
                block.params[file.id] = `${DISPLAY_PATH}${session.user.uid}/${fileName}.${fileType}`;
            });
            v.parse(BLOCKSCHEMA[block.type].VALIDATE, block.params);
        }
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Datos incorrectos" }, { status: 500 });
    }

    if (!checkAndCreateUserFolder(session.user.uid.toString())) {
        return NextResponse.json({ error: "Error creating user folder" }, { status: 500 });
    }

    // Save files
    try {
        console.log("Files to save: ", filesToSave.length);
        for (const file of filesToSave) {
            const isFileSaved = await saveFile(file.blob, `${USER_FOLDER_PATH}${session.user.uid}/`, file.name, file.maxSize, file.extension);
            if (!isFileSaved) return NextResponse.json({ error: `Error saving file ${file.name}` }, { status: 400 });
        }
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: e }, { status: 400 });
    }

    try {
        console.log(projectData);

        const contentBlocksSave = projectData.contentBlocks.map((block) => ({
            type: block.type,
            params: block.params,
        }));
        console.log(contentBlocksSave);
        // Fetch existing tutors for the TFG
        const existingTutors = await prisma.tutorTFG.findMany({
            where: { tfgId: user.personalProjectId },
            select: { userId: true },
        });
        const existingTutorIds = existingTutors.map((tutor) => tutor.userId);
        // Determine which tutors to remove and which to add
        const tutorsToRemove = existingTutorIds.filter((id) => !projectData.tutors.includes(id));
        const tutorsToAdd = projectData.tutors.filter((id) => !existingTutorIds.includes(id));
        await prisma.$transaction(async (prismaTransaction) => {
            const tfgId = user.personalProjectId;

            if (tfgId === null) {
                return NextResponse.json({ error: "Project doesn't exist" }, { status: 400 });
            }

            // Update the TFG with new data
            await prismaTransaction.tfg.update({
                where: {
                    id: tfgId,
                },
                data: {
                    title: projectData.title,
                    banner: projectData.banner!,
                    description: projectData.description,
                    documentLink: projectData.documentLink,
                    pages: projectData.pages,
                    titulationId: projectData.titulationId,
                    categoryId: projectData.categoryId,
                    departmentId: projectData.departmentId,
                    thumbnail: projectData.thumbnail!,
                    tags: projectData.tags,
                    contentBlocks: JSON.stringify(contentBlocksSave),
                    collegeId: projectData.collegeId,
                },
            });

            // Remove tutors that are no longer needed
            if (tutorsToRemove.length > 0) {
                await prismaTransaction.tutorTFG.deleteMany({
                    where: {
                        tfgId,
                        userId: { in: tutorsToRemove },
                    },
                });
            }

            // Add new tutors
            if (tutorsToAdd.length > 0) {
                await prismaTransaction.tutorTFG.createMany({
                    data: tutorsToAdd.map((userId) => ({
                        tfgId,
                        userId,
                        assignedBy: session.user.uid,
                    })),
                });
            }
        });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Error saving project" }, { status: 500 });
    }
    /*
    await prisma.tfg.create({data: {
        thumbnail: "",
        banner: "",
        title: "",
        description: "0",
        content: "",
        pages: 0,
        documentLink: "",
        tags: [],
        views: 0,
        score: 0,
        scoredTimes: 0,

        departmentId: 0,
        categoryId: 0,
        titulationId: 0,
        collegeId: 0,
    }})*/
    return NextResponse.json({ success: true }, { status: 200 });

    //const isFileSaved = await saveFile(file);

    //if(!isFileSaved)
    //return NextResponse.json({ error: "Error saving file" }, { status: 400 });

    return NextResponse.json(true);
}

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json("/dashboard", { status: 401 });

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.uid },
            select: {
                personalProjectId: true,
            },
        });

        if (!user || !!user.personalProjectId) return NextResponse.json({ success: false, response: "Project already exists" });

        const [category, titulation] = await Promise.all([
            prisma.category.findFirst({
                orderBy: {
                    name: "asc",
                },
            }),
            prisma.titulation.findFirst({
                orderBy: {
                    name: "asc",
                },
            }),
        ]);

        if (!category || !titulation)
            return NextResponse.json({ success: false, response: "No categories or titulations found. Can't create new TFG" });

        let tfg: ProjectFormData = {
            ...partialDefaultProjectData,
            category: {
                id: category.id,
                name: category.name,
            },
            titulation: {
                id: titulation.id,
                name: titulation.name,
            },
        };
        await prisma.$transaction(async (prismaTransaction) => {
            const tfgDb = await prismaTransaction.tfg.create({
                data: {
                    title: tfg.title,
                    banner: tfg.banner,
                    description: tfg.description,
                    documentLink: "",
                    pages: 0,
                    titulationId: titulation.id,
                    categoryId: category.id,
                    departmentId: null,
                    thumbnail: tfg.thumbnail,
                    tags: [],
                    contentBlocks: JSON.stringify(tfg.contentBlocks),
                    status: TFGStatus.DRAFT,
                    views: 0,
                    score: 0,
                    scoredTimes: 0,
                    collegeId: session.user.collegeId,
                },
            });

            tfg.id = tfgDb.id;

            await prismaTransaction.user.update({
                where: { id: session.user.uid },
                data: { personalProjectId: tfg.id },
            });
        });

        return NextResponse.json({ success: true, response: tfg });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, response: "Error saving file." });
    }
}
