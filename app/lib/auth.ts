import { getServerSession, Session } from "next-auth";
import { Role } from "./enums";
import { authOptions } from "./authOptions";
import { badResponse } from "../utils/util";
import { NextResponse } from "next/server";

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
    }> | null;
};

export async function checkAuthorization(requiredRoles?: Role[]): Promise<AuthorizationResponse> {
    const session = await getServerSession(authOptions);
    if (!session) return { session: null, response: badResponse("Not signed in", 401) };
    if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(session.user.role)) return { session: null, response: badResponse("Not authorized", 403) };
    }
    return { session: session, response: null };
}

export type CanModify = {
    canModify: boolean;
    response: NextResponse<{
        success: boolean;
        response: string;
    }> | null;
};
export function canModifyCollege(role: Role, sessionCollege: number, collegeId: any) {
    const _collegeId = parseInt(collegeId);
    if (isNaN(_collegeId)) return { canModifyCollege: false, response: badResponse("Invalid college id", 400) };
    // If the user is a MANAGER it can't change other college's departments info, just it's own
    else if (role === Role.MANAGER && sessionCollege !== _collegeId)
        return { canModifyCollege: false, response: badResponse("You are not authorized to modify this college", 403) };

    return { canModifyCollege: true, response: null };
}
