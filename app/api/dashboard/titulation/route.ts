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
        const { newTitulationName } = body;

        const newTitulation = await prisma.titulation.create({
            data: {
                collegeId: session.user.collegeId,
                name: newTitulationName,
            },
        });
        return successResponse(newTitulation, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating titulation", 500);
    }
}

export async function PUT(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;
    try {
        const body = await request.json();
        const { titulationId, newTitulationName } = body;
        const id = parseInt(titulationId);
        if (isNaN(id) || isNullOrEmpty(newTitulationName)) return badResponse("Invalid titulation name or id", 400);

        if (session.user.role !== Role.ADMIN) {
            // Check if user is trying to modify a department of another college
            // and get the number of projects that are using the department
            const titulation = await prisma.titulation.findFirst({
                where: {
                    id: titulationId,
                    collegeId: session.user.collegeId,
                },
            });
            if (!titulation) return badResponse("You are not authorized to update this titulation or it does not exist", 403);
        }

        const updated = await prisma.titulation.update({
            where: {
                id,
            },
            data: {
                name: newTitulationName,
            },
        });
        return successResponse(updated, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating titulation", 500);
    }
}

export async function DELETE(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        const { titulationId, fallbackTitulationId } = body;
        const id = parseInt(titulationId);
        const fallbackId = parseInt(fallbackTitulationId);

        if (isNaN(id)) return badResponse("Invalid id", 400);
        
        let projectCount = 0;
        if (session.user.role !== Role.ADMIN) {
            // Check if user is trying to modify a titulation of another college unless it's ADMIN
            // and get the number of projects that are using the titulation
            const titulation = await prisma.titulation.findFirst({
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
            if (!titulation) return badResponse("Category doesn't exist", 403);
            projectCount = titulation._count.tfgs;
        }
        
        if (projectCount > 0 && isNaN(fallbackId)) return badResponse("Invalid fallback titulation id", 400);

        await prisma.$transaction(async (prismaTransaction) => {
            if (projectCount > 0) {
                await prismaTransaction.tfg.updateMany({
                    where: {
                        titulationId: id,
                    },
                    data: {
                        titulationId: fallbackId,
                    },
                });
            }

            await prismaTransaction.titulation.delete({
                where: {
                    id,
                },
            });
        });

        return successResponse("Titulation deleted", 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error deleting titulation", 500);
    }
}
