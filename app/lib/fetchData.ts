import { Category, PopularTag, Titulation } from "../types/interfaces";
import { getValidLimit } from "../utils/util";
import prisma from "./db";

export const getAllCategories = async () => {
    const categories = (await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    })) as Category[];
    return categories;
};

export const getAllTitulations = async () => {
    const titulations = (await prisma.titulation.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    })) as Titulation[];
    return titulations;
}

    
export const getTopTags = async (number_of_tags: number) => {
    const popularTags = await prisma.$queryRaw<Array<{ tag: string; count: BigInt }>>`
        SELECT unnest(tags) as tag, COUNT(*) as count
        FROM "tfg"
        GROUP BY tag
        ORDER BY count DESC
        LIMIT ${number_of_tags}
    `;

    const serializedTags = popularTags.map(tag => ({
        ...tag,
        count: Number(tag.count.toString()),
    })) as PopularTag[];

    return serializedTags
}