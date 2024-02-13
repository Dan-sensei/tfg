import prisma from "@/app/utils/db";
import { tfgFields } from "@/app/types/prismaFieldDefs";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetId = parseInt(searchParams.get("target") || "", 10);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const pageSize = Math.max(parseInt(searchParams.get("pageSize") || "3", 10), 1);

    if (isNaN(targetId)) {
        return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    const [category, totalElements] = await Promise.all([
        prisma.category.findUnique({
            where: { id: targetId },
            select: { name: true },
        }),
        prisma.tFG.count({ where: { categoryId: targetId } }),
    ]);

    if (!category) {
        return new Response(JSON.stringify({ error: "Category not found" }), { status: 404 });
    }

    const totalPages = Math.ceil(totalElements / pageSize);
    const pageAdjusted = Math.min(page, totalPages) || 1;

    const tfgs = await prisma.tFG.findMany({
        where: { categoryId: targetId },
        select: tfgFields,
        take: pageSize,
        skip: (pageAdjusted - 1) * pageSize,
    });
    
    return new Response(JSON.stringify({
        tfgs,
        page: pageAdjusted,
        pageSize,
        totalElements,
        totalPages,
        category: category.name
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
