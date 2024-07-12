import { badResponse, isNullOrEmpty, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { checkAuthorization, REQUIRED_ROLES } from "@/app/lib/auth";
import { Role } from "@/app/lib/enums";

export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        
        const { newCategoryName } = body;
        
        const newCategory = await prisma.category.create({
            data: {
                name: newCategoryName,
            },
        });
        return successResponse(newCategory, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating category", 500);
    }
}

export async function PUT(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
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
        return successResponse(updated, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error updating category", 500);
    }
}

export async function DELETE(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();

        const { categoryId, fallbackCategoryId } = body;

        const id = parseInt(categoryId);
        const fallbackId = parseInt(fallbackCategoryId);

        if (isNaN(id)) return badResponse("Invalid id", 400);

        const category = await prisma.category.findFirst({
            where: {
                id: id,
            },
            select: {
                _count: {
                    select: {
                        tfgs: true,
                    },
                }
            }
        });
        if (!category) return badResponse("Category doesn't exist", 403);
        const projectCount = category._count.tfgs;
        
        if (projectCount > 0 && isNaN(fallbackId)) return badResponse("Invalid fallback category id", 400);
        
        await prisma.$transaction(async (prismaTransaction) => {
            if (projectCount > 0) {
                await prismaTransaction.tfg.updateMany({
                    where: {
                        categoryId: id,
                    },
                    data: {
                        categoryId: fallbackId,
                    },
                });
            }

            await prismaTransaction.category.delete({
                where: {
                    id,
                },
            });
        });

        return successResponse("Category deleted", 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error deleting category", 500);
    }
}
