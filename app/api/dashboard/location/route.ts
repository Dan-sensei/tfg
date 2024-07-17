import { badResponse, isNullOrEmpty, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import {
    checkAuthorization,
    checkCanModifyInCollege,
    checkCanModifyInCollegeWithCount,
    CheckType,
    getAuthorizedCollegeId,
    REQUIRED_ROLES,
} from "@/app/lib/auth";
import * as v from "valibot";
import { DeleteSchema, LocationSchema } from "@/app/lib/schemas";
import { Location } from "@/app/types/interfaces";
import { getAllLocationsWithDefenseCount } from "@/app/lib/fetchData";

const createOrUpdateLocation = async (locationData: v.InferInput<typeof LocationSchema>, collegeId: number) => {
    const newData = {
        name: locationData.name,
        collegeId: collegeId,
        mapLink: locationData.mapLink,
    };
    const newLocation: Location = await prisma.location.upsert({
        where: {
            id: locationData.id,
        },
        update: newData,
        create: newData,
    });

    return newLocation;
};

export async function GET(request: NextRequest) {
    try {
        const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
        if (!session) return response;

        const collegeId = getAuthorizedCollegeId(session, request.nextUrl.searchParams.get("collegeId"));

        const locations = await getAllLocationsWithDefenseCount(collegeId);
        return successResponse(locations);
    } catch (error) {
        console.error(error);
        return badResponse("Error getting locations", 500);
    }
}

// Create
export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        const { locationData } = body;
        const result = v.safeParse(LocationSchema, locationData);
        if (!result.success) return badResponse("Datos incorrectos", 400);

        const collegeId = getAuthorizedCollegeId(session, body.collegeId);
        const newLocation = await createOrUpdateLocation(result.output, collegeId);

        return successResponse(newLocation, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating location", 500);
    }
}

// Update
export async function PUT(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;
    try {
        const body = await request.json();

        const { locationData } = body;
        const result = v.safeParse(LocationSchema, locationData);
        if (!result.success) return badResponse("Datos incorrectos", 400);

        if (!(await checkCanModifyInCollege(session, CheckType.LOCATION, result.output.id, body.collegeId)))
            return badResponse("You are not authorized to update this location or it does not exist", 403);

        const newLocation = await createOrUpdateLocation(result.output, session.user.collegeId);
        return successResponse(newLocation, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error updating location", 500);
    }
}

// Delete
export async function DELETE(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    try {
        const body = await request.json();
        const { deleteData } = body;

        const validateResult = v.safeParse(DeleteSchema, deleteData);
        if (!validateResult.success) return badResponse("Datos incorrectos", 400);
        const { targetId, fallbackId } = validateResult.output;

        const defenseCount = await checkCanModifyInCollegeWithCount(session, CheckType.LOCATION, targetId, body.collegeId);
        if (defenseCount === null) return badResponse("You are not authorized to update this location or it does not exist", 403);

        if (defenseCount > 0 && !fallbackId) return badResponse("Invalid fallback titulation id", 400);

        await prisma.$transaction(async (prismaTransaction) => {
            if (defenseCount > 0 && fallbackId) {
                await prismaTransaction.defense.updateMany({
                    where: {
                        locationId: targetId,
                    },
                    data: {
                        locationId: fallbackId,
                    },
                });
            }

            await prismaTransaction.location.delete({
                where: {
                    id: targetId,
                },
            });
        });

        return successResponse(true, 200);
    } catch (error) {
        console.error(error);
        return badResponse("Error deleting location", 500);
    }
}
