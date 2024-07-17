import { badResponse, isNullOrEmpty, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { checkAuthorization, getAuthorizedCollegeId, REQUIRED_ROLES } from "@/app/lib/auth";
import * as v from "valibot";
import { DeleteSchema } from "@/app/lib/schemas";
import { getAllCategoriesWithProjectCount } from "@/app/lib/fetchData";
import { revalidateTag } from "next/cache";

export async function GET() {
    try {
        const { session, response } = await checkAuthorization(REQUIRED_ROLES.ONLY_ADMIN);
        if (!session) return response;
        const categories = await getAllCategoriesWithProjectCount();
        return successResponse(categories);
    } catch (error) {
        console.error(error);
        return badResponse("Error getting locations", 500);
    }
}

export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.ONLY_ADMIN);
    if (!session) return response;

    try {
        const body = await request.json();

        const { newCategoryName } = body;
        const newCategory = await prisma.category.create({
            data: {
                name: newCategoryName,
            },
        });
        revalidateTag("categories");
        return successResponse(newCategory, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating category", 500);
    }
}

export async function PUT(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.ONLY_ADMIN);
    if (!session) return response;
    try {
        const body = await request.json();
        const { categoryId, newCategoryName } = body;

        const id = parseInt(categoryId);

        if (isNaN(id) || isNullOrEmpty(newCategoryName)) return badResponse("Invalid category name or id", 400);

        const updated = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name: newCategoryName,
            },
        });

        revalidateTag("categories");
        return successResponse(updated, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error updating category", 500);
    }
}

export async function DELETE(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.ONLY_ADMIN);
    if (!session) return response;

    try {
        const body = await request.json();
        const { deleteData } = body;

        const validateResult = v.safeParse(DeleteSchema, deleteData);
        if (!validateResult.success) return badResponse("Datos incorrectos", 400);
        const { targetId, fallbackId } = validateResult.output;

        const category = await prisma.category.findFirst({
            where: {
                id: targetId,
            },
            select: {
                _count: {
                    select: {
                        tfgs: true,
                    },
                },
            },
        });
        if (!category) return badResponse("Category doesn't exist", 403);
        const projectCount = category._count.tfgs;

        if (projectCount > 0 && !fallbackId) return badResponse("Invalid fallback category id", 400);

        await prisma.$transaction(async (prismaTransaction) => {
            if (projectCount > 0 && fallbackId) {
                await prismaTransaction.tfg.updateMany({
                    where: {
                        categoryId: targetId,
                    },
                    data: {
                        categoryId: fallbackId,
                    },
                });
            }

            await prismaTransaction.category.delete({
                where: {
                    id: targetId,
                },
            });
        });

        revalidateTag("categories");
        return successResponse(true, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error deleting category", 500);
    }
}
