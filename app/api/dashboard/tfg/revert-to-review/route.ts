import { authOptions } from "@/app/lib/authOptions";
import { Role, TFGStatus } from "@/app/lib/enums";
import { badResponse, successResponse } from "@/app/utils/util";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/db";
import { NextRequest } from "next/server";
import { checkAuthorization, REQUIRED_ROLES } from "@/app/lib/auth";

export async function PUT(request: NextRequest) {
    const {session, response} = await checkAuthorization(REQUIRED_ROLES.MINIMUM_TUTOR);
    if(!session) return response;
    
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
