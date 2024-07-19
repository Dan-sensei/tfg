import { TFGStatus } from "@/app/lib/enums";
import { iPublishCheck } from "@/app/types/interfaces";
import { badResponse, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { checkAuthorization, REQUIRED_ROLES } from "@/app/lib/auth";

const compareArrays = (arr1: any[], arr2: any[]): boolean => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};

const comparePublishChecks = (obj1: iPublishCheck, obj2: iPublishCheck): boolean => {
    for (const key of Object.keys(obj1)) {
        const obj1Value = (obj1 as any)[key];
        const obj2Value = (obj2 as any)[key];
        if (Array.isArray(obj1Value) && Array.isArray(obj2Value)) {
            if (!compareArrays(obj1Value, obj2Value)) {
                return false;
            }
        } else if (obj1Value !== obj2Value) {
            return false;
        }
    }
    return true;
};

export async function POST(request: NextRequest) {
    const {session, response} = await checkAuthorization(REQUIRED_ROLES.MINIMUM_TUTOR);
    if(!session) return response;

    try {
        const TFGData: iPublishCheck = await request.json();
        const savedTFG = await prisma.tfg.findUnique({
            where: {
                id: TFGData.id,
            },
            select: {
                id: true,
                status: true,
                title: true,
                description: true,
                categoryId: true,
                titulationId: true,
                departmentId: true,
                banner: true,
                thumbnail: true,
                contentBlocks: true,
                pages: true,
                tags: true,
                documentLink: true,
            },
        });

        if (!savedTFG) return badResponse("TFG not found", 404);
        if (savedTFG.status !== TFGStatus.SENT_FOR_REVIEW) return badResponse("TFG already published or DRAFT", 400);
        // Check if TFG has been modified since the page was loaded
        const mappedSavedTFG: iPublishCheck = {
            id: savedTFG.id,
            title: savedTFG.title,
            description: savedTFG.description,
            categoryId: savedTFG.categoryId,
            titulationId: savedTFG.titulationId,
            departmentId: savedTFG.departmentId,
            banner: savedTFG.banner,
            thumbnail: savedTFG.thumbnail,
            contentBlocks: savedTFG.contentBlocks,
            pages: savedTFG.pages,
            tags: savedTFG.tags,
            documentLink: savedTFG.documentLink,
        };
        if (!comparePublishChecks(TFGData, mappedSavedTFG)) {
            return badResponse("El proyecto se ha modificado mientras lo veías recarga la página", 400);
        }

        await prisma.tfg.update({
            where: {
                id: TFGData.id,
            },
            data: {
                status: TFGStatus.PUBLISHED,
            },
        });
        return successResponse("¡Publicado!")
    } catch (err) {
        console.log(err);
        return badResponse("Error publishing TFG", 500);
    }
}
