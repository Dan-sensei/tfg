import { TRENDING_WEIGHTS } from "@/app/lib/config";
import prisma from "@/app/lib/db";
import iRedis from "@/app/lib/iRedis";
import { RedisSet } from "@/app/types/interfaces";
import { unstable_noStore as noStore } from 'next/cache';

import pMap from "p-map";

type ViewsData = {
    totalViews: number;
    createdAt: Date;
    viewsThisWeek: number;
    viewsLastWeek: number;
    viewsLastMonth: number;
};

interface ViewsAggregateResult extends ViewsData {
    tfgId: number;
}

async function fetchAllViews() {
    const viewsResult: ViewsAggregateResult[] = await prisma.$queryRaw`
    SELECT t."id" AS "tfgId",  t."views" as "totalViews", t."createdAt",
        SUM(CASE
                WHEN d."date" >= current_date - interval '7 days' THEN d."views"
                ELSE 0
            END) as "viewsThisWeek",
        SUM(CASE
                WHEN d."date" > current_date - interval '7 days'
                AND d."date" >= current_date - interval '14 days' THEN d."views"
                ELSE 0
            END) as "viewsLastWeek",
        SUM(CASE
                WHEN d."date" >= current_date - interval '30 days' THEN d."views"
                ELSE 0
            END) as "viewsLastMonth"
        FROM "tfg" t
        LEFT JOIN "daily_tfg_view" d ON t."id" = d."tfgId"
        GROUP BY t."id"
    `;
    const processedResults = viewsResult.map((result) => ({
        tfgId: result.tfgId,
        totalviews: Number(result.totalViews),
        createdAt: new Date(result.createdAt),
        viewsThisWeek: Number(result.viewsThisWeek),
        viewsLastWeek: Number(result.viewsLastWeek),
        viewsLastMonth: Number(result.viewsLastMonth),
    }));
    return processedResults;
}

function calculateTrendingScore(viewsData: ViewsData) {
    const now = new Date();
    const ageInWeeks = Math.floor(
        (now.getTime() - viewsData.createdAt.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
    );
    const decayFactor = 1 / (1 + ageInWeeks);
    const cappedTotalViews = Math.min(
        viewsData.totalViews,
        TRENDING_WEIGHTS.TOTAL_VIEWS_CAP
    );

    return viewsData.viewsThisWeek * TRENDING_WEIGHTS.WEEK_1
    + viewsData.viewsLastWeek * TRENDING_WEIGHTS.WEEK_2
    + viewsData.viewsLastMonth * TRENDING_WEIGHTS.MONTH
    + cappedTotalViews * TRENDING_WEIGHTS.TOTAL * decayFactor;;
}

async function calculateDailyViews() {
    const exists = await iRedis.exists("dailyViewsCurrent");
    if (!exists) return;
    await iRedis.del("dailyViewsPrevious");
    const currentViews = (await iRedis.zRangeWithScores(
        "dailyViewsCurrent",
        0,
        -1,
        {
            REV: true
        }
    ));
    
    console.log(currentViews);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setUTCHours(1, 0, 0, 0);

    const mapper = async (view: RedisSet) => {
        const tfgId = view.member.split(":")[1];
        const viewsCount = view.score;
        try{

            await prisma.tfg.update({
                where: { id: Number(tfgId) },
                data: { views: { increment: viewsCount } },
            });
            
            await prisma.daily_tfg_view.upsert({
                where: { tfgId_date: { tfgId: Number(tfgId), date: yesterday } },
                update: { views: viewsCount },
                create: {
                    tfgId: Number(tfgId),
                    views: viewsCount,
                    date: yesterday,
                },
            });
        }catch(e){
            console.error(e)
        }
    };
    await pMap(currentViews, mapper, { concurrency: 3 });
    await iRedis.rename("dailyViewsCurrent", "dailyViewsPrevious");
}
async function cleanUpInvalidRedisEntries() {
    try {
        const redisEntries = await iRedis.zRange("trending_tfgs", 0, -1);
        console.log(redisEntries)
        const tfgIdsFromRedis = redisEntries.map(entry => Number(entry));
        redisEntries.forEach(e => console.log(e))
        const existingTfgIds = await prisma.tfg.findMany({
            select: { id: true }
        }).then(tfgs => tfgs.map(tfg => tfg.id));

        const existingTfgIdSet = new Set(existingTfgIds);

        const invalidIds = tfgIdsFromRedis.filter(tfgId => !existingTfgIdSet.has(tfgId));
        if (invalidIds.length > 0) {
            await iRedis.zRem("trending_tfgs", invalidIds.map(id => id.toString()));
            console.log(`Removed ${invalidIds.length} invalid TFG IDs from Redis.`);
        } else {
            console.log("No invalid TFG IDs found in Redis.");
        }
    } catch (e) {
        console.error('Failed to clean up invalid Redis entries:', e);
    }
}

async function updateTrendingScores() {
    try {
        const viewsThisWeekForAllTfgs = await fetchAllViews();
        const batchSize = 500;
        let scoreMemberPairsBatch = [];

        for (const views of viewsThisWeekForAllTfgs) {
            const trendScore = calculateTrendingScore({
                totalViews: views.totalviews,
                createdAt: views.createdAt,
                viewsThisWeek: views.viewsThisWeek,
                viewsLastWeek: views.viewsLastWeek,
                viewsLastMonth: views.viewsLastMonth,
            });
            scoreMemberPairsBatch.push({
                score: trendScore,
                member: views.tfgId.toString(),
            });

            if (scoreMemberPairsBatch.length >= batchSize) {
                await iRedis.zAdd("trending_tfgs", scoreMemberPairsBatch);
                scoreMemberPairsBatch = [];
            }
        }

        if (scoreMemberPairsBatch.length > 0) {
            await iRedis.zAdd("trending_tfgs", scoreMemberPairsBatch);
        }

    } catch (e) {
        console.error('Failed to update trending scores:', e);
        throw e;
    }
}

export async function GET() {
    noStore()
    try{
        await calculateDailyViews();
        await updateTrendingScores();
        await cleanUpInvalidRedisEntries();
        return new Response("Success");
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
