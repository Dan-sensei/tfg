import prisma from "@/app/lib/db";
import { iTFG } from "@/app/types/interfaces";
import iRedis from "@/app/lib/iRedis";
import { successResponse } from "@/app/utils/util";
import { PAGINATION_SIZE } from "@/app/types/defaultData";
export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("currentpage") || "1", 10), 1);

    const startIndex = (page - 1) * PAGINATION_SIZE;
    const endIndex = startIndex + PAGINATION_SIZE - 1;
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
        const unorderedTfgs = (await prisma.tfg.findMany({
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
        const totalPages = Math.ceil(totalElements / PAGINATION_SIZE);
        const pageAdjusted = Math.min(page, totalPages) || 1;

        return successResponse({
            tfgs: orderedTfgs,
            currentPage: pageAdjusted,
            totalPages,
        });
    } catch (e: unknown) {
        let error = "Error";
        if (typeof e === "string") {
            error = e;
        } else if (e instanceof Error) {
            error = e.message
        }
        return new Response(error, { status: 500 });
    }
}
