import prisma from "@/app/lib/db";
import { iFullTFG } from "@/app/types/interfaces";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if(!id || isNaN(parseInt(id, 10))) {
        return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const tfg = (await prisma.tFG.findUnique({
        where: {
            id: parseInt(id, 10),
        },
        select: {
            id: true,
            thumbnail: true,
            banner: true,
            title: true,
            description: true,
            author: true,
            tutor: true,
            content: true,
            pages: true,
            documentLink: true,
            tags: true,
            views: true,
            score: true,
            createdAt: true,
        },
    })) as iFullTFG;    
    
    return new Response(JSON.stringify(tfg), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}