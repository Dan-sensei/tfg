import prisma from "@/app/lib/db";
import { tfgFields } from "@/app/types/prismaFieldDefs";
import redis from "@/app/lib/redis";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetId = parseInt(searchParams.get("target") || "", 10);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const pageSize = Math.max(
        parseInt(searchParams.get("pageSize") || "3", 10),
        1
    );

    if (isNaN(targetId)) {
        return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
        });
    }

    let result = await redis.hGetAll(`category:${targetId}`);
    let categoryData = result && Object.keys(result).length
        ? {
              name: result.name,
              totalElements: parseInt(result.totalElements, 10),
          }
        : null;

    if (!categoryData) {
        const [category, totalElements] = await Promise.all([
            prisma.category.findUnique({
                where: { id: targetId },
                select: { name: true },
            }),
            prisma.tFG.count({ where: { categoryId: targetId } }),
        ]);
        if (!category) {
            return new Response(
                JSON.stringify({ error: "Category not found" }),
                { status: 404 }
            );
        }

        categoryData = {
            name: category.name,
            totalElements: totalElements,
        };
        await redis.hSet(`category:${targetId}`, categoryData);
    }

    const totalPages = Math.ceil(categoryData.totalElements / pageSize);
    const pageAdjusted = Math.min(page, totalPages) || 1;

    const tfgs = await prisma.tFG.findMany({
        where: { categoryId: targetId },
        select: tfgFields,
        take: pageSize,
        skip: (pageAdjusted - 1) * pageSize,
    });

    return new Response(
        JSON.stringify({
            tfgs,
            page: pageAdjusted,
            pageSize,
            totalElements: categoryData.totalElements,
            totalPages,
            category: categoryData.name,
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}
