import {
    Category,
    CategoryWithTFGCount,
    DepartmentWithTFGCount,
    FullCollege,
    FullDepartment,
    LocationWithDefenseCount,
    PopularTag,
    Titulation,
    TitulationByCollege,
    TitulationWithTFGCount,
} from "../types/interfaces";
import prisma from "./db";
import { TFGStatus } from "./enums";

export const getAllCategories = async () => {
    const categories = (await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    })) as Category[];
    return categories;
};

export const getAllCategoriesWithProjectCount = async (): Promise<CategoryWithTFGCount[]> => {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true, _count: { select: { tfgs: true } } },
        orderBy: { name: "asc" },
    });

    return categories.map((category) => ({
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

export const getProjectsInTitulationWithProjectCount = async (
    titulationId: number,
    publishedProjects?: boolean
): Promise<TitulationWithTFGCount | null> => {
    const titulation = await prisma.titulation.findUnique({
        where: { id: titulationId },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    tfgs: {
                        where: publishedProjects ? { status: TFGStatus.PUBLISHED } : {},
                    },
                },
            },
        },
    });

    if (!titulation) return null;

    return {
        id: titulation.id,
        name: titulation.name,
        totalProjects: titulation._count.tfgs,
    };
};
export const getAllTitulationsByCollege = async () => {
    const titulations = await prisma.college.findMany({
        select: { id: true, name: true, titulation: { select: { id: true, name: true }, orderBy: { name: "asc" } } },
        orderBy: { name: "asc" },
    });

    return titulations.map((college) => ({
        collegeId: college.id,
        collegeName: college.name,
        titulations: college.titulation,
    })) as TitulationByCollege[];
};

export const getAllDepartments = async (collegeId?: number) => {
    const titulations = (await prisma.department.findMany({
        where: collegeId ? { collegeId: collegeId } : {},
        select: { id: true, name: true, link: true },
        orderBy: { name: "asc" },
    })) as FullDepartment[];
    return titulations;
};
export const getAllDepartmentsWithProjectCount = async (collegeId?: number): Promise<DepartmentWithTFGCount[]> => {
    const departments = await prisma.department.findMany({
        where: collegeId ? { collegeId: collegeId } : {},
        select: { id: true, name: true, link: true, _count: { select: { tfgs: true } } },
        orderBy: { name: "asc" },
    });

    return departments.map((titulation) => ({
        id: titulation.id,
        name: titulation.name,
        link: titulation.link,
        totalProjects: titulation._count.tfgs,
    }));
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

export const getAllLocationsWithDefenseCount = async (collegeId?: number): Promise<LocationWithDefenseCount[]> => {
    const locations = await prisma.location.findMany({
        where: collegeId ? { collegeId: collegeId } : {},
        select: { id: true, name: true, mapLink: true, _count: { select: { defenses: true } } },
        orderBy: { name: "asc" },
    });

    return locations.map((location) => ({
        id: location.id,
        name: location.name,
        mapLink: location.mapLink,
        totalDefenses: location._count.defenses,
    }));
};

export const getAllColleges = async () => {
    const colleges = (await prisma.college.findMany({
        select: { id: true, name: true, image: true },
        orderBy: { name: "asc" },
    })) as FullCollege[];
    return colleges;
};

export const getAllPublishedProjectsCount = async (): Promise<number> => {
    const publishedProjectsCount = await prisma.tfg.count({
        where: { status: TFGStatus.PUBLISHED },
    });
    console.log(publishedProjectsCount);
    return publishedProjectsCount;
}