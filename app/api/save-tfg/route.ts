import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink, stat } from "fs/promises";
import sharp from 'sharp';
import prisma from "@/app/lib/db";

const removePreviousFile = async (filePath: string) => {
    try {
        await stat(filePath);
        await unlink(filePath);
        return true;
    } catch (err) {
        return false;
    }
}

const saveFile = async(file: File) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    const filepath = path.join(process.cwd(), "public/assets/" + filename);

    // Check image type and file size
    const fileTypeRegex = /image\/(jpeg|jpg|png)/;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!fileTypeRegex.test(file.type)) {
        return { success: false, error: 'Invalid file type. Only images are allowed.' };
    }

    if (file.size > maxSize) {
        return { success: false, error: `File size exceeds limit of ${maxSize / (1024 * 1024)}MB.` };
    }
    
    
    await removePreviousFile(filepath)
    try {
    
        const compressedBuffer = await sharp(buffer)
            .jpeg({ quality: 80 }) 
            .toBuffer();

        await removePreviousFile(filepath);
        await writeFile(filepath, compressedBuffer);
        return { success: true };
       
        await writeFile(filepath, buffer);

        return true;
    } catch (error) {
        return false;
    }
}

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const banner = data.get("banner") as File | null;
    const thumbnail = data.get("thumbnail") as File | null;
    const tfgDataRaw = data.get("tfgData") as string | null;
    if (!banner || !thumbnail || !tfgDataRaw) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }
    
    let tfgData;
    try{
        tfgData = JSON.parse(tfgDataRaw);
    }catch(e) {
        console.log(e)
        return NextResponse.json({ error: "Error parseando datos" }, { status: 500 });
    }
    
    console.log(tfgData)
    const newTfg = {}

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
    }})
*/
    return NextResponse.json(true);

    //const isFileSaved = await saveFile(file);

    //if(!isFileSaved)
        //return NextResponse.json({ error: "Error saving file" }, { status: 400 });

    return NextResponse.json(true);

}
