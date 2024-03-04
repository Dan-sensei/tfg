"use server";
import { headers } from "next/headers";
import prisma from "@/app/lib/db";
import redis  from "@/app/lib/redis";
import { DELAY_VIEW_RECORD } from "./config";

export async function increaseTFGViews(tfgId: number) {
    const ip = headers().get("x-forwarded-for")?.split(",")[0].trim();

    if (!ip) {
        return;
    }

    const existingView = await redis.get(`views:${tfgId}:${ip}`);
    if (!existingView) {
        await redis.set(`views:${tfgId}:${ip}`, "1", {
            NX: true,
            EX: DELAY_VIEW_RECORD,
        });
        await redis.zIncrBy("dailyViewsCurrent", 1, `tfgId:${tfgId}`);
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
    const hasVoted = await redis.sIsMember(voteKey, ip);

    if (!hasVoted) {
        await redis.sAdd(voteKey, ip);
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
