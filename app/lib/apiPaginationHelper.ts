import prisma from "@/app/lib/db";
import { tfgFields } from "@/app/types/prismaFieldDefs";
import { badResponse, successResponse } from "@/app/utils/util";
import { PAGINATION_SIZE } from "@/app/types/defaultData";
import { TFGStatus } from "@/app/lib/enums";
import * as v from "valibot";
import { PaginationSchema, PaginationSchemaAllProjects } from "@/app/lib/schemas";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    // Validate input with valibot
    const validateResult = v.safeParse(PaginationSchema, {
        currentPage: request.nextUrl.searchParams.get("currentPage"),
        totalElements: request.nextUrl.searchParams.get("totalElements"),
        id: request.nextUrl.searchParams.get("categoryId"),
    });
    if (!validateResult.success) return badResponse("Invalid id", 400);

    const { currentPage, id: titulationId, totalElements } = validateResult.output;

    try {
        const totalPages = Math.ceil(totalElements / PAGINATION_SIZE);
        const pageAdjusted = Math.min(currentPage, totalPages) || 1;
        const tfgs = await prisma.tfg.findMany({
            where: { titulationId: titulationId, status: TFGStatus.PUBLISHED },
            select: tfgFields,
            take: PAGINATION_SIZE,
            skip: (pageAdjusted - 1) * PAGINATION_SIZE,
        });

        return successResponse({
            tfgs,
            currentPage: pageAdjusted,
            totalPages,
        });
    } catch (e) {
        return badResponse("Error al cargar la categoria", 500);
    }
}

export const getPaginatedProjectsFilteredByFor = async (
    columnId: string,
    idParam: string | null,
    totalElementsParam: string | null,
    currentPageParam: string | null,
    orderByParam: string | null = "views",
    orderDirectionParam: string | null = "desc"
) => {
    const validateResult = v.safeParse(PaginationSchema, {
        currentPage: currentPageParam,
        totalElements: totalElementsParam,
        id: idParam,
        orderBy: orderByParam,
        orderDirection: orderDirectionParam,
    });
    if (!validateResult.success) return badResponse("Invalid id", 400);

    const { currentPage, id, totalElements, orderBy, orderDirection } = validateResult.output;
    try {
        const totalPages = Math.ceil(totalElements / PAGINATION_SIZE);
        const pageAdjusted = Math.min(currentPage, totalPages) || 1;

        const tfgs = await prisma.tfg.findMany({
            where: { [columnId]: id, status: TFGStatus.PUBLISHED },
            select: tfgFields,
            take: PAGINATION_SIZE,
            skip: (pageAdjusted - 1) * PAGINATION_SIZE,
            orderBy: { [orderBy]: orderDirection },
        });

        return successResponse({
            tfgs,
            currentPage: pageAdjusted,
            totalPages,
        });
    } catch (e) {
        console.log(e)
        return badResponse("Error al cargar la categoria", 500);
    }
};

export const getAllPaginatedProjects = async (
    totalElementsParam: string | null,
    currentPageParam: string | null,
    orderByParam: string | null = "views",
    orderDirectionParam: string | null = "desc"
) => {
    const validateResult = v.safeParse(PaginationSchemaAllProjects, {
        currentPage: currentPageParam,
        totalElements: totalElementsParam,
        orderBy: orderByParam,
        orderDirection: orderDirectionParam,
    });
    if (!validateResult.success) return badResponse("Invalid id", 400);

    const { currentPage, totalElements, orderBy, orderDirection } = validateResult.output;
    try {
        const totalPages = Math.ceil(totalElements / PAGINATION_SIZE);
        const pageAdjusted = Math.min(currentPage, totalPages) || 1;

        const tfgs = await prisma.tfg.findMany({
            where: { status: TFGStatus.PUBLISHED },
            select: tfgFields,
            take: PAGINATION_SIZE,
            skip: (pageAdjusted - 1) * PAGINATION_SIZE,
            orderBy: { [orderBy]: orderDirection },
        });

        return successResponse({
            tfgs,
            currentPage: pageAdjusted,
            totalPages,
        });
    } catch (e) {
        console.log(e)
        return badResponse("Error al cargar la categoria", 500);
    }
};
