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
import { Role } from "@/app/lib/enums";
import * as v from "valibot";
import { DeleteSchema } from "@/app/lib/schemas";
import { getAllDepartmentsWithProjectCount } from "@/app/lib/fetchData";

export async function GET(request: NextRequest) {
    try {
        const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
        if (!session) return response;

        const collegeId = getAuthorizedCollegeId(session, request.nextUrl.searchParams.get("collegeId"));
        const departments = await getAllDepartmentsWithProjectCount(collegeId);
        return successResponse(departments);
    } catch (error) {
        console.error(error);
        return badResponse("Error getting locations", 500);
    }
}

// Create
export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();

        const { newDepartmentName, newLink } = body;

        if (isNullOrEmpty(newDepartmentName)) return badResponse("Invalid department name", 400);
        const collegeId = getAuthorizedCollegeId(session, body.collegeId);
        const newDepartment = await prisma.department.create({
            data: {
                name: newDepartmentName,
                collegeId: collegeId,
                link: newLink && typeof newLink === "string" ? newLink : null,
            },
        });
        return successResponse(newDepartment, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating department", 500);
    }
}

// Update
export async function PUT(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;
    try {
        const body = await request.json();

        const { departmentId, newDepartmentName, newDepartmentLink } = body;

        const id = parseInt(departmentId);
        if (isNaN(id)) return badResponse("Invalid department id", 400);
        else if (isNullOrEmpty(newDepartmentName)) return badResponse("Invalid department name", 400);

        if (!checkCanModifyInCollege(session, CheckType.DEPARTMENT, id, body.collegeId))
            return badResponse("You are not authorized to update this department or it does not exist", 403);

        const updated = await prisma.department.update({
            where: {
                id,
            },
            data: {
                name: newDepartmentName,
                link: newDepartmentLink && typeof newDepartmentLink === "string" ? newDepartmentLink : null,
            },
        });
        return successResponse(updated, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error updating department", 500);
    }
}

// Delete
export async function DELETE(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        const { deleteData } = body;

        const validateResult = v.safeParse(DeleteSchema, deleteData);
        if (!validateResult.success) return badResponse("Datos incorrectos", 400);
        const { targetId, fallbackId } = validateResult.output;

        const projectCount = await checkCanModifyInCollegeWithCount(session, CheckType.DEPARTMENT, targetId, body.collegeId);
        if (projectCount === null) return badResponse("You are not authorized to update this department or it does not exist", 403);

        await prisma.$transaction(async (prismaTransaction) => {
            if (projectCount > 0 && fallbackId) {
                await prismaTransaction.tfg.updateMany({
                    where: {
                        departmentId: targetId,
                    },
                    data: {
                        departmentId: fallbackId,
                    },
                });
            }

            await prismaTransaction.department.delete({
                where: {
                    id: targetId,
                },
            });
        });

        return successResponse("Department deleted", 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error deleting department", 500);
    }
}
