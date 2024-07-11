import { badResponse, isNullOrEmpty, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { canModifyCollege, checkAuthorization, REQUIRED_ROLES } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        const canModify = canModifyCollege(session.user.role, session.user.collegeId, body.collegeId);
        if (!canModify.canModifyCollege) return canModify.response;

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
        const canModify = canModifyCollege(session.user.role, session.user.collegeId, body.collegeId);
        if (!canModify.canModifyCollege) return canModify.response;


        const { titulationId, newTitulationName } = body;

        const id = parseInt(titulationId);

        if (isNaN(id) || isNullOrEmpty(newTitulationName)) return badResponse("Invalid titulation name or id", 400);

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
        const canModify = canModifyCollege(session.user.role, session.user.collegeId, body.collegeId);
        if (!canModify.canModifyCollege) return canModify.response;
        
        const { titulationId, fallbackTitulationId, projectCount } = body;

        const id = parseInt(titulationId);
        const fallbackId = parseInt(fallbackTitulationId);
        const count = parseInt(projectCount);

        if (isNaN(id)) return badResponse("Invalid id", 400);
        else if (count > 0 && isNaN(fallbackId)) return badResponse("Invalid fallback category id", 400);

        await prisma.$transaction(async (prismaTransaction) => {
            if (count > 0) {
                await prismaTransaction.tfg.updateMany({
                    where: {
                        titulationId: id,
                        collegeId: session.user.collegeId,
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
