import prisma from "@/app/utils/db";
export async function GET() {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    })
    return new Response(JSON.stringify(categories), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}