import prisma from "@/app/lib/db";
import redis from "@/app/lib/redis";
import { iTFG } from "@/app/types/interfaces";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const pageSize = Math.max(
        parseInt(searchParams.get("pageSize") || "10", 10),
        1
    );
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
        
        const tfgMap = new Map(unorderedTfgs.map(tfg => [tfg.id, tfg]));
        const orderedTfgs = tfgIds.map(id => tfgMap.get(id)).filter(tfg => tfg);

        const totalElements = await redis.zCard("trending_tfgs");
        const totalPages = Math.ceil(totalElements / pageSize);
        const pageAdjusted = Math.min(page, totalPages) || 1;

        return new Response(JSON.stringify({
            tfgs: orderedTfgs,
            page: pageAdjusted,
            pageSize: pageSize,
            totalElements: totalElements,
            totalPages,
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Oops, we hit a snag:", error);
        return new Response(
            JSON.stringify({ error: "Error accesing trending data" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
