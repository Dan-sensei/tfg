"use server";

import { headers } from "next/headers";
import prisma from "@/app/lib/db";
import { DELAY_VIEW_RECORD, POPULAR_TAGS_DISPLAY } from "@/app/lib/config";
import { unstable_cache as cache } from "next/cache";
import { DAY } from "@/app/types/defaultData";
import iRedis from "../iRedis";

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

export async function getMyScore(tfgId: number) {
    try {
        const ip = headers().get("x-forwarded-for")?.split(",")[0].trim();

        if (!ip) {
            return 0;
        }

        const vote = await prisma.votelog.findUnique({
            where: {
                tfgId_ip: {
                    tfgId,
                    ip,
                },
            },
        });

        return vote ? vote.score : 0;
    } catch (e) {
        return 0;
    }
}

export async function castScore(tfgId: number, givenScore: number) {
    const ip = headers().get("x-forwarded-for")?.split(",")[0].trim();

    if (!ip) {
        return { success: false, response: "No podemos registrar tu voto" };
    }

    const voteLog = await prisma.votelog.findUnique({
        where: {
            tfgId_ip: {
                tfgId,
                ip,
            },
        },
        select: {
            score: true,
            dailyVoteCount: true,
            lastUpdated: true,
            tfg: {
                select: {
                    score: true,
                    scoredTimes: true,
                },
            },
        },
    });

    const now = new Date();
    let dailyVoteCount = 1;
    let oldScore = 0;
    if (voteLog) {
        const lastUpdated = new Date(voteLog.lastUpdated);
        const isSameDay =
            lastUpdated.getDate() === now.getDate() && lastUpdated.getMonth() === now.getMonth() && lastUpdated.getFullYear() === now.getFullYear();

        if (isSameDay) {
            dailyVoteCount = voteLog.dailyVoteCount + 1;
        }

        if (isSameDay && voteLog.dailyVoteCount >= 3) {
            return { succes: false, response: "Ya has editado tu voto suficiente por hoy" };
        }
        oldScore = voteLog.score;
    }

    let currentScore = 0;
    let scoredTimes = 0;
    if (voteLog) {
        currentScore = voteLog.tfg.score;
        scoredTimes = voteLog.tfg.scoredTimes;
    } else {
        const tfgWithScore = await prisma.tfg.findUnique({
            where: {
                id: tfgId,
            },
            select: {
                score: true,
                scoredTimes: true,
            },
        });

        if (!tfgWithScore) {
            return { success: false, response: "No se ha podido encontrar el TFG" };
        }

        currentScore = tfgWithScore.score;
        scoredTimes = tfgWithScore.scoredTimes;
    }

    const newScoredTimes = !voteLog ? scoredTimes + 1 : scoredTimes;
    const newTotalScore = currentScore * scoredTimes - oldScore + givenScore;
    const newScore = parseFloat((newTotalScore / newScoredTimes).toFixed(2));

    await prisma.$transaction(async (prismaTransaction) => {
        await prismaTransaction.votelog.upsert({
            where: {
                tfgId_ip: {
                    tfgId,
                    ip,
                },
            },
            create: {
                tfgId,
                ip,
                score: givenScore,
                lastUpdated: now,
                dailyVoteCount: 1,
            },
            update: {
                score: givenScore,
                lastUpdated: now,
                dailyVoteCount: dailyVoteCount,
            },
        });
        await prismaTransaction.tfg.update({
            where: {
                id: tfgId,
            },
            data: {
                score: newScore,
                scoredTimes: newScoredTimes,
            },
        });
    });

    return { success: true, response: "¡Gracias por tu voto!" };
}
