import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import sharp from "sharp";
import prisma from "@/app/lib/db";
import {
    MAX_BANNER_DIMENSIONS,
    MAX_BANNER_SIZE,
    MAX_BLOCK_IMAGE_DIMENSIONS,
    MAX_BLOCK_IMAGE_SIZE,
    MAX_THUMBNAIL_DIMENSIONS,
    MAX_THUMBNAIL_SIZE,
    partialDefaultProjectData,
} from "@/app/types/defaultData";
import { TFGStatus } from "@/app/lib/enums";
import { dimension, ProjectFormData, ProjectFromDataSend } from "@/app/types/interfaces";
import { badResponse, getFileType, roundTwoDecimals, successResponse } from "@/app/utils/util";
import * as v from "valibot";
import { BLOCKSCHEMA, FormSchema } from "@/app/components/TFG_BlockDefinitions/BlockDefs";
import fs from "fs";
import { checkAuthorization } from "@/app/lib/auth";

const USER_FOLDER_PATH = "public/assets/users/";
const DISPLAY_PATH = "/assets/users/";
const BACKUP_PREFIX = "__b__";

interface FileToSave {
    name: string;
    blob: Blob;
    maxSize: number;
    maxDimensions: dimension;
    extension: string;
}

const removeFilesExcept = (directoryPath: string, whitelist: string[]) => {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
        if (!whitelist.includes(file)) {
            console.log(file);
            fs.unlinkSync(path.join(directoryPath, file));
        }
    }
};

function backupFiles(directoryPath: string) {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
        const originalFile = path.join(directoryPath, file);
        const backupFile = path.join(directoryPath, BACKUP_PREFIX + file);
        fs.renameSync(originalFile, backupFile);
    }
    return files;
}

function restoreFilesWihoutOverwrite(directoryPath: string, filesToRestore: string[]) {
    for (const file of filesToRestore) {
        const backupFile = path.join(directoryPath, BACKUP_PREFIX + file);
        const originalFile = path.join(directoryPath, file);
        if (fs.existsSync(originalFile)) {
            fs.unlinkSync(backupFile);
            continue;
        }
        fs.renameSync(backupFile, originalFile);
    }
}

function restoreUserFolder(directoryPath: string, filesToRestore: string[]) {
    const files = fs.readdirSync(directoryPath);

    removeFilesExcept(
        directoryPath,
        files.filter((file) => file.startsWith(BACKUP_PREFIX))
    );

    for (const file of filesToRestore) {
        const backupFile = path.join(directoryPath, BACKUP_PREFIX + file);
        const originalFile = path.join(directoryPath, file);
        fs.renameSync(backupFile, originalFile);
    }
}

const saveFile = async (blob: Blob, pathFolder: string, name: string, maxSize: number, maxDimensions: dimension, fileType: string) => {
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
        else
            compressedBuffer = await sharp(buffer)
                .resize({
                    width: maxDimensions.width,
                    height: maxDimensions.height,
                    fit: "inside",
                    withoutEnlargement: true,
                })
                .jpeg({ quality: 80 })
                .toBuffer();

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
    const {session, response} = await checkAuthorization();
    if(!session) return response;

    const user = await prisma.user.findUnique({
        where: { id: session.user.uid },
        select: {
            personalProject: {
                select: {
                    id: true,
                    status: true
                }
            },
        },
    });
    if (!user || user.personalProject === null) return badResponse("El proyecto no existe", 400);
    if(user.personalProject.status === TFGStatus.PUBLISHED){
        return badResponse("El proyecto ya sido publicado", 400);
    }

    const data = await request.formData();

    const projectDataRaw = data.get("projectData") as string | null;
    if (!projectDataRaw) {
        return badResponse("No project data received.", 400);
    }

    const filesToSave: FileToSave[] = [];
    let filesWhiteList = ["banner.jpg", "thumbnail.jpg"];

    // Check if project data is valid
    let projectData: ProjectFromDataSend;
    try {
        //Will throw error if parse fails
        projectData = JSON.parse(projectDataRaw);
        if (projectData.banner === null) {
            const fileName = "banner";
            const blob = data.get(fileName) as Blob | null;
            if (!blob) return NextResponse.json({ succcess: false, message: `No ${fileName} image received` }, { status: 400 });
            projectData.banner = `${DISPLAY_PATH}${session.user.uid}/${fileName}.jpg`;
            filesToSave.push({ name: fileName, blob: blob, maxSize: MAX_BANNER_SIZE, maxDimensions: MAX_BANNER_DIMENSIONS, extension: "jpg" });
        }
        if (projectData.thumbnail === null) {
            const fileName = "thumbnail";
            const blob = data.get(fileName) as Blob | null;
            if (!blob) return NextResponse.json({ succcess: false, message: `No ${fileName} image received` }, { status: 400 });
            projectData.thumbnail = `${DISPLAY_PATH}${session.user.uid}/${fileName}.jpg`;
            filesToSave.push({ name: fileName, blob: blob, maxSize: MAX_THUMBNAIL_SIZE, maxDimensions: MAX_THUMBNAIL_DIMENSIONS, extension: "jpg" });
        }
        v.parse(FormSchema, projectData);

        for (const block of projectData.contentBlocks) {
            block.files.forEach((file) => {
                const fileName = `block-${block.id}-${file.id}`;
                const blob = data.get(fileName) as Blob | null;
                if (!blob) return NextResponse.json({ succcess: false, message: `No ${fileName} image received` }, { status: 400 });

                const fileType = getFileType(blob.type).toLowerCase();
                filesToSave.push({
                    name: fileName,
                    blob: blob,
                    maxSize: MAX_BLOCK_IMAGE_SIZE,
                    maxDimensions: MAX_BLOCK_IMAGE_DIMENSIONS,
                    extension: fileType,
                });
                const parsedBlockData = JSON.parse(block.data);
                parsedBlockData[file.id] = `${DISPLAY_PATH}${session.user.uid}/${fileName}.${fileType}`;
                if (!BLOCKSCHEMA[block.type].VALIDATE(parsedBlockData).success) {
                    throw new Error(`Invalid block data: Block #${block.id}`);
                }
                block.data = JSON.stringify(parsedBlockData);
            });
            // Reset file list to return back to front end
            block.files = [];
            filesWhiteList = filesWhiteList.concat(BLOCKSCHEMA[block.type].getFileNames(block.data));
        }
    } catch (e) {
        console.log(e);
        return badResponse(`Datos incorrectos`, 500);
    }

    // Check and create user folder if doesn't exist
    if (!checkAndCreateUserFolder(session.user.uid.toString())) {
        return badResponse("Error creating user folder", 500);
    }

    const userFolder = `${USER_FOLDER_PATH}${session.user.uid}`;
    const originalFiles = backupFiles(userFolder);

    try {
        // Save files
        for (const file of filesToSave) {
            const isFileSaved = await saveFile(
                file.blob,
                `${USER_FOLDER_PATH}${session.user.uid}/`,
                file.name,
                file.maxSize,
                file.maxDimensions,
                file.extension
            );
            if (!isFileSaved) throw new Error(`Error saving file ${file.name} in user ${session.user.uid}`);
        }

        restoreFilesWihoutOverwrite(userFolder, originalFiles);

        // Remove unreferenced files
        filesWhiteList = filesWhiteList.map((filePath) => path.basename(filePath));
        removeFilesExcept(userFolder, filesWhiteList);
    } catch (e) {
        console.log(e);
        restoreUserFolder(userFolder, originalFiles);
        return badResponse(`Error saving files`, 500);
    }

    try {
        const contentBlocksSave = projectData.contentBlocks.map((block) => ({
            type: block.type,
            data: block.data,
        }));
        // Fetch existing tutors for the TFG
        const existingTutors = await prisma.tutorTFG.findMany({
            where: { tfgId: user.personalProject.id },
            select: { userId: true },
        });
        const existingTutorIds = existingTutors.map((tutor) => tutor.userId);
        // Determine which tutors to remove and which to add
        const tutorsToRemove = existingTutorIds.filter((id) => !projectData.tutors.includes(id));
        const tutorsToAdd = projectData.tutors.filter((id) => !existingTutorIds.includes(id));
        await prisma.$transaction(async (prismaTransaction) => {
            const tfgId = user.personalProject?.id;

            if (!tfgId) {
                return badResponse(`Project doesn't exist`, 500);
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
                    status: TFGStatus.SENT_FOR_REVIEW,
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
        return badResponse("Error saving project", 500);
    }

    const newTFG: ProjectFormData = {
        id: user.personalProject.id,
        thumbnail: projectData.thumbnail,
        banner: projectData.banner,
        title: projectData.title,
        description: projectData.description,
        tutors: projectData.tutors.map((tutor) => ({
            id: tutor,
            name: "",
            socials: "",
            personalPage: "",
            image: "",
        })),
        department: projectData.departmentId
            ? {
                  id: projectData.departmentId,
                  name: "",
                  link: "",
              }
            : null,
        category: {
            id: projectData.categoryId,
            name: "",
        },
        titulation: {
            id: projectData.titulationId,
            name: "",
        },
        pages: projectData.pages,
        contentBlocks: projectData.contentBlocks,
        documentLink: projectData.documentLink,
        tags: projectData.tags,
    };
    return successResponse(newTFG, 200);
}

// New Project
export async function POST() {
    const {session, response} = await checkAuthorization();
    if(!session) return response;

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
