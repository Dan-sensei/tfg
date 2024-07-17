import { badResponse, isNullOrEmpty, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import {
    checkAuthorization,
    checkCanModifyInCollege,
    checkCanModifyInCollegeWithCount,
    CheckType,
    getAuthorizedCollegeId,
    REQUIRED_ROLES,
} from "@/app/lib/auth";
import * as v from "valibot";
import { DeleteSchema } from "@/app/lib/schemas";
import { getAllTitulationsWithProjectCount } from "@/app/lib/fetchData";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
    try {
        const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
        if (!session) return response;

        const collegeId = getAuthorizedCollegeId(session, request.nextUrl.searchParams.get("collegeId"));
        const titulations = await getAllTitulationsWithProjectCount(collegeId);
        return successResponse(titulations);
    } catch (error) {
        console.error(error);
        return badResponse("Error getting locations", 500);
    }
}

export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        const { newTitulationName } = body;

        const collegeId = getAuthorizedCollegeId(session, body.collegeId);
        const newTitulation = await prisma.titulation.create({
            data: {
                collegeId: collegeId,
                name: newTitulationName,
            },
        });

        revalidateTag("all-titulations");
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

        // Check if user is trying to modify a department of another college unless ADMIN
        if (!(await checkCanModifyInCollege(session, CheckType.TITULATION, id, body.collegeId)))
            badResponse("You are not authorized to update this titulation or it does not exist", 403);

        const updated = await prisma.titulation.update({
            where: {
                id,
            },
            data: {
                name: newTitulationName,
            },
        });

        revalidateTag("all-titulations");
        return successResponse(updated, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error updating titulation", 500);
    }
}

export async function DELETE(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        const { deleteData } = body;

        const validateResult = v.safeParse(DeleteSchema, deleteData);
        if (!validateResult.success) return badResponse("Datos incorrectos", 400);
        const { targetId, fallbackId } = validateResult.output;

        const projectCount = await checkCanModifyInCollegeWithCount(session, CheckType.TITULATION, targetId, body.collegeId);
        if (projectCount === null) return badResponse("You are not authorized to delete this titulation or it does not exist", 403);

        if (projectCount > 0 && !fallbackId) return badResponse("Invalid fallback titulation id", 400);

        await prisma.$transaction(async (prismaTransaction) => {
            if (projectCount > 0 && fallbackId) {
                await prismaTransaction.tfg.updateMany({
                    where: {
                        titulationId: targetId,
                    },
                    data: {
                        titulationId: fallbackId,
                    },
                });
            }

            await prismaTransaction.titulation.delete({
                where: {
                    id: targetId,
                },
            });
        });

        revalidateTag("all-titulations");
        return successResponse(true, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error deleting titulation", 500);
    }
}
