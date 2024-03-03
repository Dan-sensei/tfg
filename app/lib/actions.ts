"use server";
import { headers } from "next/headers";
import prisma from "@/app/lib/db";
import { redis } from "@/app/lib/redis";
import { DELAY_VIEW_RECORD } from "../utils/config";

export async function increaseTFGViews(tfgId: number) {
    const ip = headers().get("x-forwarded-for")?.split(",")[0].trim();

    if (!ip) {
        return;
    }

    const existingView = await redis.get(`views:${tfgId}:${ip}`);
    if (!existingView) {
        await redis.set(`views:${tfgId}:${ip}`, "1", {
            NX: true,
            EX: DELAY_VIEW_RECORD
        });
        await prisma.tFG.update({
            where: {
                id: tfgId,
            },
            data: {
                views: {
                    increment: 1
                },
            },
        });
    }
}

