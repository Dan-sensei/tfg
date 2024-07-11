import { Category, CategoryWithTFGCount, Department, FullDepartment, PopularTag, Titulation, TitulationWithTFGCount } from "../types/interfaces";
import { getValidLimit } from "../utils/util";
import prisma from "./db";

export const getAllCategories = async () => {
    const categories = (await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    })) as Category[];
    return categories;
};

export const getAllCategoriesWithProjectCount= async (): Promise<CategoryWithTFGCount[]>  => {
    const categories = (await prisma.category.findMany({
        select: { id: true, name: true, _count: { select: { tfgs: true } } },
        orderBy: { name: "asc" },
    }));

    return categories.map(category => ({
        id: category.id,
        name: category.name,
        totalProjects: category._count.tfgs,
    }));
};

export const getAllTitulations = async (collegeId?: number) => {
    const titulations = (await prisma.titulation.findMany({
        where: collegeId ? { collegeId: collegeId } : {},
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    })) as Titulation[];
    return titulations;
};
export const getAllTitulationsWithProjectCount= async (collegeId?: number): Promise<TitulationWithTFGCount[]>  => {
    const titulations = (await prisma.titulation.findMany({
        where: collegeId ? { collegeId: collegeId } : {},
        select: { id: true, name: true, _count: { select: { tfgs: true } } },
        orderBy: { name: "asc" },
    }));

    return titulations.map(titulation => ({
        id: titulation.id,
        name: titulation.name,
        totalProjects: titulation._count.tfgs,
    }));
};
export const getAllDepartments = async (collegeId?: number) => {
    const titulations = (await prisma.department.findMany({
        where: collegeId ? { collegeId: collegeId } : {},
        select: { id: true, name: true, link: true },
        orderBy: { name: "asc" },
    })) as FullDepartment[];
    return titulations;
};

export const getTopTags = async (number_of_tags: number) => {
    const popularTags = await prisma.$queryRaw<Array<{ tag: string; count: BigInt }>>`
        SELECT unnest(tags) as tag, COUNT(*) as count
        FROM "tfg"
        GROUP BY tag
        ORDER BY count DESC
        LIMIT ${number_of_tags}
    `;

    const serializedTags = popularTags.map((tag) => ({
        ...tag,
        count: Number(tag.count.toString()),
    })) as PopularTag[];

    return serializedTags;
};
