import { badResponse, isNullOrEmpty, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { canModifyCollege, checkAuthorization, REQUIRED_ROLES } from "@/app/lib/auth";
import { Role } from "@/app/lib/enums";

// Create
export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        // Check collegeId and user permissions on college
        const canModify = canModifyCollege(session.user.role, session.user.collegeId, body.collegeId);
        if (!canModify.canModifyCollege) return canModify.response;

        const { newDepartmentName, collegeId, newLink } = body;

        if (isNullOrEmpty(newDepartmentName)) return badResponse("Invalid department name", 400);
        const newDepartment = await prisma.department.create({
            data: {
                name: newDepartmentName,
                collegeId: parseInt(collegeId),
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
        const canModify = canModifyCollege(session.user.role, session.user.collegeId, body.collegeId);
        if (!canModify.canModifyCollege) return canModify.response;

        const { departmentId, newDepartmentName, newDepartmentLink } = body;

        const id = parseInt(departmentId);
        if (isNaN(id)) return badResponse("Invalid department id", 400);
        else if (isNullOrEmpty(newDepartmentName)) return badResponse("Invalid department name", 400);

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
        return badResponse("Error creating department", 500);
    }
}

// Delete
export async function DELETE(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        const canModify = canModifyCollege(session.user.role, session.user.collegeId, body.collegeId);
        if (!canModify.canModifyCollege) return canModify.response;

        const { departmentId, fallbackDepartmentId, projectCount } = body;

        const id = parseInt(departmentId);
        const fallbackId = parseInt(fallbackDepartmentId);
        const count = parseInt(projectCount);

        if (isNaN(id)) return badResponse("Invalid department id", 400);
        await prisma.$transaction(async (prismaTransaction) => {
            if (count > 0 && fallbackId) {
                await prismaTransaction.tfg.updateMany({
                    where: {
                        departmentId: id,
                    },
                    data: {
                        departmentId: fallbackId,
                    },
                });
            }

            await prismaTransaction.department.delete({
                where: {
                    id,
                },
            });
        });

        return successResponse("Department deleted", 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error deleting department", 500);
    }
}
