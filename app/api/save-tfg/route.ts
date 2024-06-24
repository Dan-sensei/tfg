import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink, stat } from "fs/promises";
import sharp from 'sharp';

const removePreviousFile = async (filePath: string) => {
    try {
        await stat(filePath);
        await unlink(filePath);
        return true;
    } catch (err) {
        return false
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
    const file = data.get("file") as File | null;
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }
    
    const isFileSaved = saveFile(file);

    if(!isFileSaved)
        return NextResponse.json({ error: "Error saving file" }, { status: 400 });

    return NextResponse.json(true);

}
