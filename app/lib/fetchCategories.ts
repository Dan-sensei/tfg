import { Category } from "../types/interfaces";
import prisma from "./db";

export const getAllCategories = async () => {
    const categories = (await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    })) as Category[];
    return categories;
};
