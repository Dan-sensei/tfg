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