import { badResponse, isNullOrEmpty, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { checkAuthorization, REQUIRED_ROLES } from "@/app/lib/auth";
import { Role } from "@/app/lib/enums";

const checkIfCanModify = async (role: Role, departmentId: number, collegeId: number) => {
    if (role !== Role.ADMIN) {
        const department = await prisma.department.findFirst({
            where: {
                id: departmentId,
                collegeId: collegeId,
            },
        });
        return !!department;
    }
    return true;
};

// Create
export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();

        const { newDepartmentName, newLink } = body;

        if (isNullOrEmpty(newDepartmentName)) return badResponse("Invalid department name", 400);
        
        const newDepartment = await prisma.department.create({
            data: {
                name: newDepartmentName,
                collegeId: session.user.collegeId,
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

        if (session.user.role !== Role.ADMIN) {
            // Check if user is trying to modify a department of another college
            const department = await prisma.department.findFirst({
                where: {
                    id: departmentId,
                    collegeId: session.user.collegeId,
                },
            });
            if (!department) return badResponse("You are not authorized to update this department or it does not exist", 403);
        }

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
        const { departmentId, fallbackDepartmentId } = body;

        const _departmentId = parseInt(departmentId);
        const fallbackId = parseInt(fallbackDepartmentId);

        if (isNaN(_departmentId)) return badResponse("Invalid department id", 400);

        let projectCount = 0;
        if (session.user.role !== Role.ADMIN) {
            // Check if user is trying to modify a department of another college
            // and get the number of projects that are using the department
            const department = await prisma.department.findFirst({
                where: {
                    id: departmentId,
                    collegeId: session.user.collegeId,
                },
                select: {
                    _count: {
                        select: {
                            tfgs: true,
                        },
                    }
                }
            });
            if (!department) return badResponse("You are not authorized to update this department or it does not exist", 403);
            projectCount = department._count.tfgs;
        }
        
        await prisma.$transaction(async (prismaTransaction) => {
            if (projectCount > 0 && fallbackId) {
                await prismaTransaction.tfg.updateMany({
                    where: {
                        departmentId: _departmentId,
                    },
                    data: {
                        departmentId: fallbackId,
                    },
                });
            }

            await prismaTransaction.department.delete({
                where: {
                    id: _departmentId,
                },
            });
        });

        return successResponse("Department deleted", 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error deleting department", 500);
    }
}
