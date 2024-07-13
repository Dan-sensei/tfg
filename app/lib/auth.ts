import { getServerSession, Session } from "next-auth";
import { Role } from "./enums";
import { authOptions } from "./authOptions";
import { badResponse } from "../utils/util";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { Prisma } from "@prisma/client";
import { check } from "valibot";

export const REQUIRED_ROLES = {
    MINIMUM_TUTOR: [Role.TUTOR, Role.MANAGER, Role.ADMIN],
    MINIMUM_MANAGER: [Role.MANAGER, Role.ADMIN],
    ONLY_ADMIN: [Role.ADMIN],
};

export type AuthorizationResponse = {
    session: Session | null;
    response: NextResponse<{
        success: boolean;
        response: string;
    }>;
};

export async function checkAuthorization(requiredRoles?: Role[]): Promise<AuthorizationResponse> {
    const response: AuthorizationResponse = { session: null, response: badResponse("Not authorized", 403) };
    const session = await getServerSession(authOptions);
    if (!session) return response;

    if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(session.user.role)) return response;
    }

    response.session = session;
    return response;
}


export enum CheckType {
    DEPARTMENT = 0,
    TITULATION,
    LOCATION,
    DEFENSE
}

interface Check {
    check: (id: number, collegeId: number) => Promise<boolean>;
    checkWithCount?: (id: number, collegeId: number) => Promise<number | null>;
}


export const CHECKS: Record<CheckType, Check> = {
    [CheckType.DEPARTMENT]: {
        check: async (departmentId: number, collegeId: number) => {
            const exists = await prisma.department.findFirst({
                where: {
                    id: departmentId,
                    collegeId: collegeId,
                },
            })
            return !!exists;
        },
        checkWithCount: async (departmentId: number, collegeId: number) => {
            const department = await prisma.department.findFirst({
                where: {
                    id: departmentId,
                    collegeId: collegeId,
                },
                select: {
                    _count: {
                        select: {
                            tfgs: true,
                        },
                    }
                }
            });
            return department ? department._count.tfgs : null;
        }
    },
    [CheckType.TITULATION]: {
        check: async (titulationId: number, collegeId: number) => {
            const exists = await prisma.titulation.findFirst({
                where: {
                    id: titulationId,
                    collegeId: collegeId,
                },
            })
            return !!exists;
        },
        checkWithCount: async (titulationId: number, collegeId: number) => {
            const titulation = await prisma.titulation.findFirst({
                where: {
                    id: titulationId,
                    collegeId: collegeId,
                },
                select: {
                    _count: {
                        select: {
                            tfgs: true,
                        },
                    }
                }
            });
            return titulation ? titulation._count.tfgs : null;
        }
    },
    [CheckType.LOCATION]: {
        check: async (locationId: number, collegeId: number) => {
            const exists = await prisma.location.findFirst({
                where: {
                    id: locationId,
                    collegeId: collegeId,
                },
            })
            return !!exists;
        },
        checkWithCount: async (locationId: number, collegeId: number) => {
            const location = await prisma.location.findFirst({
                where: {
                    id: locationId,
                    collegeId: collegeId,
                },
                select: {
                    _count: {
                        select: {
                            defenses: true,
                        },
                    },
                },
            });
            return location ? location._count.defenses : null;
        }
    },
    [CheckType.DEFENSE]: {
        check: async (defenseId: number, collegeId: number) => {
            const exists = await prisma.defense.findFirst({
                where: {
                    id: defenseId,
                    collegeId: collegeId,
                },
            })
            return !!exists;
        }
    },
};

export async function checkCanModifyInCollege(
    session: Session,
    type: CheckType,
    targeId: number,
    requestedCollegeId: string | null
): Promise<boolean> {
    
    const authorizedCollegeId = getAuthorizedCollegeId(session, requestedCollegeId);
    const check = CHECKS[type].check;
    const canModify = await check(targeId, authorizedCollegeId);
    return canModify;

}
export async function checkCanModifyInCollegeWithCount(
    session: Session,
    type: CheckType,
    targeId: number,
    requestedCollegeId: string | null | undefined
): Promise<number | null> {
    
    const authorizedCollegeId = getAuthorizedCollegeId(session, requestedCollegeId);
    const check = CHECKS[type].checkWithCount;
    if(!check) throw new Error("checkWithCount is not implemented for this type");
    const canModify = await check(targeId, authorizedCollegeId);
    return canModify;

}


export function getAuthorizedCollegeId(
    session: Session,
    requestedCollegeId: string | null | undefined
): number {
    const parsedRequestedCollegeId = parseInt(requestedCollegeId ?? "", 10);
    const roleIsAdmin = session.user.role === Role.ADMIN;
    return roleIsAdmin && !isNaN(parsedRequestedCollegeId) ? parsedRequestedCollegeId : session.user.collegeId;
}
