"use server";
import prisma from "@/app/lib/db";

export async function getFavorites(ids: number[]) {
    const favorites = await prisma.tFG.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: {
            id: true,
            thumbnail: true,
            title: true,
            description: true,
            views: true,
            score: true,
            pages: true,
            createdAt: true,
        }
    });
    return JSON.stringify(favorites);
}