import { checkAuthorization, REQUIRED_ROLES } from "@/app/lib/auth";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { badResponse, successResponse } from "@/app/utils/util";
import * as v from "valibot";
import { DefenseDataSchema } from "@/app/lib/schemas";
import { Role } from "@/app/lib/enums";
import { DefenseData } from "@/app/types/interfaces";

const checkIfCanModify = async (role: Role, id: number, collegeId: number) => {
    if (role !== Role.ADMIN) {
        // Check if user is trying to modify a department of another college
        // and get the number of projects that are using the department
        const defense = await prisma.defense.findFirst({
            where: {
                id,
                collegeId,
            },
        });
        if (!defense) return false;
    }
    return true;
};

const validateDefense = (defenseData: any) => {
    return v.safeParse(DefenseDataSchema, {
        ...defenseData,
        startTime: new Date(defenseData.startTime),
        endTime: new Date(defenseData.endTime),
    });
}

export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;
    try {
        const body = await request.json();
        const { defenseData } = body;
        const validateResult = validateDefense(defenseData);
        if (!validateResult.success) return badResponse(validateResult.issues[0].message, 400);

        // TODO: admin can change any college
        const newCategory: DefenseData = await prisma.defense.create({
            data: {
                title: validateResult.output.title,
                startTime: validateResult.output.startTime,
                endTime: validateResult.output.endTime,
                locationId: validateResult.output.location.id,
                collegeId: session.user.collegeId,
            },
            select: {
                id: true,
                title: true,
                startTime: true,
                endTime: true,
                collegeId: true,
                location: {
                    select: {
                        id: true,
                        name: true,
                        mapLink: true
                    },
                },
            }
        });

        return successResponse(newCategory, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating defense", 500);
    }
}

export async function PUT(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;
    try {
        const body = await request.json();

        const { defenseData } = body;
        const validateResult = validateDefense(defenseData);
        if (!validateResult.success) return badResponse(validateResult.issues[0].message, 400);

        if (!(await checkIfCanModify(session.user.role, validateResult.output.id, session.user.collegeId)))
            return badResponse("You are not authorized to update this titulation or it does not exist", 403);

        const newCategory = await prisma.defense.update({
            where: {
                id: validateResult.output.id,
            },
            data: {
                title: validateResult.output.title,
                startTime: validateResult.output.startTime,
                endTime: validateResult.output.endTime,
                locationId: validateResult.output.location.id,
                collegeId: session.user.collegeId,
            },
            select: {
                id: true,
                title: true,
                startTime: true,
                endTime: true,
                collegeId: true,
                location: {
                    select: {
                        id: true,
                        name: true,
                        mapLink: true
                    },
                },
            }
        });
        return successResponse(newCategory, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error updating defense", 500);
    }
}

export async function DELETE(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;
    try {
        const body = await request.json();

        const { defenseId } = body;

        const id = parseInt(defenseId);
        if (isNaN(id)) return badResponse("Invalid defense id", 400);

        if (!(await checkIfCanModify(session.user.role, id, session.user.collegeId)))
            return badResponse("You are not authorized to update this titulation or it does not exist", 403);

        await prisma.defense.delete({
            where: {
                id,
            },
        });
        return successResponse(true, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating category", 500);
    }
}
