import { badResponse, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { UserProfileSchema } from "@/app/lib/schemas";
import * as v from "valibot";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return badResponse("Unauthorized", 401);

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.uid,
            },
        });

        if (!user) return badResponse("User not found", 404);

        return successResponse({ socials: user.socials, personalPage: user.personalPage, showImage: user.showImage });
    } catch (error) {
        return badResponse("Error updating profile", 500);
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return badResponse("Unauthorized", 401);

    try {
        const body = await request.json();

        const validateResult = v.safeParse(UserProfileSchema, body);
        if(!validateResult.success) return badResponse("Datos inválidos", 400);

        const { showImage, socials, personalPage } = validateResult.output;

        await prisma.user.update({
            where: {
                id: session.user.uid,
            },
            data: {
                socials: JSON.stringify(socials),
                personalPage: personalPage,
                showImage,
            },
        });

        return successResponse("Profile updated");
    } catch (error) {
        return badResponse("Error updating profile", 500);
    }
}
