"use server";
import prisma from "@/app/lib/db";
import redis from "@/app/lib/redis";
import { iTFG } from "@/app/types/interfaces";

export async function getTrending(
    _page: number,
    _pageSize: number
) {
    const page = Math.max(_page ?? 1);
    const pageSize = Math.max(_pageSize ?? 3, 1);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;
    try {
        const tfgIdsWithScores = await redis.zRangeWithScores(
            "trending_tfgs",
            startIndex,
            endIndex,
            {
                REV: true,
            }
        );
        const tfgIds = tfgIdsWithScores.map((tfgData) =>
            parseInt(tfgData.value, 10)
        );
        const unorderedTfgs = (await prisma.tFG.findMany({
            where: {
                id: {
                    in: tfgIds,
                },
            },
            select: {
                id: true,
                thumbnail: true,
                title: true,
                description: true,
                pages: true,
                views: true,
                score: true,
                createdAt: true,
            },
        })) as iTFG[];

        const tfgMap = new Map(unorderedTfgs.map((tfg) => [tfg.id, tfg]));
        const orderedTfgs = tfgIds
            .map((id) => tfgMap.get(id))
            .filter((tfg) => tfg);

        const totalElements = await redis.zCard("trending_tfgs");
        const totalPages = Math.ceil(totalElements / pageSize);
        const pageAdjusted = Math.min(page, totalPages) || 1;

        return JSON.stringify({
            success: true,
            data: {
                tfgs: orderedTfgs,
                page: pageAdjusted,
                pageSize: pageSize,
                totalElements: totalElements,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Oops, we hit a snag:", error);
        return JSON.stringify({ success: false, error: "Error accesing trending data" })
    }
}
