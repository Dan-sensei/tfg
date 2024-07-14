import prisma from "@/app/lib/db";
import { tfgFields } from "@/app/types/prismaFieldDefs";
import { badResponse, successResponse } from "@/app/utils/util";
import { PAGINATION_SIZE } from "@/app/types/defaultData";
import { TFGStatus } from "@/app/lib/enums";
import * as v from "valibot";
import { PaginationSchema } from "@/app/lib/schemas";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    // Validate input with valibot
    const validateResult = v.safeParse(PaginationSchema, {
        currentPage: request.nextUrl.searchParams.get("currentPage"),
        id: request.nextUrl.searchParams.get("categoryId"),
    });
    if (!validateResult.success) return badResponse("Invalid id", 400);

    const { currentPage, id: CategoryId } = validateResult.output;

    try {
        // Get category name and project count
        const categoryWithProjectCount = await prisma.category.findUnique({
            where: { id: CategoryId },
            select: {
                name: true,
                _count: {
                    select: {
                        tfgs: {
                            where: { status: TFGStatus.PUBLISHED },
                        },
                    },
                },
            },
        });

        // Category does not exist
        if (!categoryWithProjectCount) return badResponse("Category not found", 404);

        const {
            name: categoryName,
            _count: { tfgs: totalElements },
        } = categoryWithProjectCount;

        const totalPages = Math.ceil(totalElements / PAGINATION_SIZE);
        const pageAdjusted = Math.min(currentPage, totalPages) || 1;

        const tfgs = await prisma.tfg.findMany({
            where: { categoryId: CategoryId, status: TFGStatus.PUBLISHED },
            select: tfgFields,
            take: PAGINATION_SIZE,
            skip: (pageAdjusted - 1) * PAGINATION_SIZE,
        });
        
        return successResponse({
            tfgs,
            currentPage: pageAdjusted,
            pageSize: PAGINATION_SIZE,
            totalElements: totalElements,
            totalPages,
            title: categoryName,
        });
    } catch (e) {
        return badResponse("Error al cargar la categoria", 500);
    }
}
