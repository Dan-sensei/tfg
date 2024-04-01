"use server";

import { headers } from "next/headers";
import prisma from "@/app/lib/db";
import { DELAY_VIEW_RECORD, POPULAR_TAGS_DISPLAY } from "@/app/lib/config";
import { unstable_cache as cache } from "next/cache";
import { DAY } from "@/app/types/defaultData";
import { stringify } from "querystring";
import iRedis from "../iRedis";

export const getPopularTags = cache(
    async () => {
        const popularTags = await prisma.$queryRaw`
            SELECT unnest(tags) as tag, COUNT(*) as count
            FROM "TFG"
            GROUP BY tag
            ORDER BY count DESC
            LIMIT ${POPULAR_TAGS_DISPLAY}
        `;
        return JSON.stringify(
            popularTags,
            (key, value) =>
                typeof value === "bigint" ? value.toString() : value
        );
    },
    ["popular-tags"],
    {
        revalidate: DAY,
    }
);

export async function increaseTFGViews(tfgId: number) {

    const ip = headers().get("x-forwarded-for")?.split(",")[0].trim();

    if (!ip) {
        return;
    }

    const existingView = await iRedis.get(`views:${tfgId}:${ip}`);
    if (!existingView) {
        await iRedis.set(`views:${tfgId}:${ip}`, "1", {
            NX: true,
            EX: DELAY_VIEW_RECORD,
        });
        await iRedis.zIncrBy("dailyViewsCurrent", 1, `tfgId:${tfgId}`);
    }
}

export async function castScore(
    tfgId: number,
    givenScore: number,
    currentScore: number,
    scoredTimes: number
) {
    const ip = headers().get("x-forwarded-for")?.split(",")[0].trim();

    if (!ip) {
        return;
    }

    const voteKey = `votes:${tfgId}`;
    const hasVoted = await iRedis.sIsMember(voteKey, ip);

    if (!hasVoted) {
        await iRedis.sAdd(voteKey, ip);
        await prisma.tFG.update({
            where: {
                id: tfgId,
            },
            data: {
                score: (givenScore + currentScore) / (scoredTimes + 1),
                scoredTimes: {
                    increment: 1,
                },
            },
        });
    }
}
