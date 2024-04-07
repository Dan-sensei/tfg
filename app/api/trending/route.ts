import prisma from "@/app/lib/db";
import { iTFG } from "@/app/types/interfaces";
import iRedis from "@/app/lib/iRedis";
import { badResponse, successResponse } from "@/app/utils/util";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const pageSize = Math.max(
        parseInt(searchParams.get("pageSize") || "10", 10),
        10
    );
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;
    try {
        const tfgIdsWithScores = await iRedis.zRange(
            "trending_tfgs",
            startIndex,
            endIndex,
            {
                REV: true,
            }
        );
        const tfgIds = tfgIdsWithScores.map((tfdId) => parseInt(tfdId, 10));
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

        const totalElements = await iRedis.zCard("trending_tfgs");
        const totalPages = Math.ceil(totalElements / pageSize);
        const pageAdjusted = Math.min(page, totalPages) || 1;

        return successResponse({
            tfgs: orderedTfgs,
            page: pageAdjusted,
            pageSize: pageSize,
            totalElements: totalElements,
            totalPages,
        });
    } catch (error) {
        return badResponse("Error accesing trending data", 500)
    }
}
