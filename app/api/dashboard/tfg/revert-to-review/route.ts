import { authOptions } from "@/app/lib/authOptions";
import { Role, TFGStatus } from "@/app/lib/enums";
import { badResponse, successResponse } from "@/app/utils/util";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return badResponse("Not signed in", 400);
    if (![Role.TUTOR, Role.MANAGER, Role.ADMIN].includes(session.user.role as Role))
        return badResponse("You don't have the permissions to do that", 400);
    const userId = session.user.uid;
    try {
        const { tfgId } = await request.json();

        await prisma.tfg.update({
            where: {
                id: tfgId,
                status: TFGStatus.PUBLISHED,
                tutors: {
                    some: {
                        userId: userId,
                    },
                },
            },
            data: {
                status: TFGStatus.SENT_FOR_REVIEW,
            },
        });
        return successResponse("Project updated successfully");
    } catch (err) {
        console.log(err);
        return badResponse("Error updating state", 500);
    }
}
