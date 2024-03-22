"use server";
import prisma from "@/app/lib/db";
import { tfgFields } from "@/app/types/prismaFieldDefs";
import redis from "@/app/lib/redis";

export async function getCategoryData(
    _targetId: number,
    _page: number,
    _pageSize: number
) {
    const targetId = _targetId ?? 10;
    const page = Math.max(_page ?? 1);
    const pageSize = Math.max(_pageSize ?? 3, 1);
    
    let result = await redis.hGetAll(`category:${targetId}`);
    let categoryData =
        result && Object.keys(result).length
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
            throw new Error("Category not found");
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

    return JSON.stringify({
        success: true,
        data: {
            tfgs,
            page: pageAdjusted,
            pageSize,
            totalElements: categoryData.totalElements,
            totalPages,
            title: categoryData.name,
        },
    });
}
