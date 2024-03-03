import prisma from "@/app/lib/db";

export async function GET(request: Request) {
    return new Response("GET FACHERO");
}

export async function POST(request: Request) {
    const {ids} = await request.json();
    const favorites = await prisma.tFG.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: {
            id: true,
            thumbnail: true,
            title: true,
            description: true,
            views: true,
            score: true,
            pages: true,
            createdAt: true,
        }
    });
    return new Response(JSON.stringify(favorites));
}