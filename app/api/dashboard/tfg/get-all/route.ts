import { checkAuthorization, REQUIRED_ROLES } from "@/app/lib/auth";
import { Role } from "@/app/lib/enums";
import { badResponse, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { iDashboardProject } from "@/app/types/interfaces";

export async function GET(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    const collegeIdParam = request.nextUrl.searchParams.get("collegeId");
    const collegeId = parseInt(collegeIdParam ?? "", 10);

    try {
        const tfgs = await prisma.tfg.findMany({
            where: {
                collegeId: session.user.role === Role.ADMIN && !isNaN(collegeId) ? collegeId : session.user.collegeId,
            },
            select: {
                id: true,
                thumbnail: true,
                title: true,
                views: true,
                score: true,
                createdAt: true,
                description: true,
                status: true,
                authors: true,
            },
        });

        const result: iDashboardProject[] = tfgs.map((tfg) => ({ ...tfg, authors: tfg.authors.map((a) => ({ name: a.name })) }));

        return successResponse(result, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error deleting project", 500);
    }
}
