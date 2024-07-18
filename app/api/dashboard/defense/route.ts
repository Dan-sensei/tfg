import { checkAuthorization, checkCanModifyInCollege, CheckType, REQUIRED_ROLES } from "@/app/lib/auth";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { badResponse, successResponse } from "@/app/utils/util";
import * as v from "valibot";
import { DefenseDataSchema, YearMonthSchema } from "@/app/lib/schemas";
import { Role } from "@/app/lib/enums";
import { DefenseData } from "@/app/types/interfaces";
import { endOfMonthUTC, startOfMonthUTC } from "@/app/utils/util";

const validateDefense = (defenseData: any) => {
    return v.safeParse(DefenseDataSchema, {
        ...defenseData,
        startTime: new Date(defenseData.startTime),
        endTime: new Date(defenseData.endTime),
    });
};

const createOrUpdateDefenseAndOrLocation = async (defenseData: v.InferInput<typeof DefenseDataSchema>, collegeId: number) => {
    let newDefense: DefenseData | null = null;
    await prisma.$transaction(async (tx) => {
        let locationId: number = defenseData.location.id;
        if (defenseData.location.id < 0) {
            const newLocation = await tx.location.create({
                data: {
                    name: defenseData.location.name,
                    mapLink: defenseData.location.mapLink,
                    collegeId: collegeId,
                },
                select: {
                    id: true,
                },
            });
            locationId = newLocation.id;
        }

        const insertDate = {
            title: defenseData.title,
            startTime: defenseData.startTime,
            endTime: defenseData.endTime,
            locationId: locationId,
            collegeId: collegeId,
        };
        newDefense = await tx.defense.upsert({
            where: {
                id: defenseData.id,
            },
            update: insertDate,
            create: insertDate,
            select: {
                id: true,
                title: true,
                startTime: true,
                endTime: true,
                collegeId: true,
                location: {
                    select: {
                        id: true,
                        name: true,
                        mapLink: true,
                    },
                },
            },
        });
    });

    return newDefense;
};

export async function GET(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;

    const yearMonthResult = v.safeParse(YearMonthSchema, {
        year: parseInt(request.nextUrl.searchParams.get("year") ?? ""),
        month: parseInt(request.nextUrl.searchParams.get("month") ?? ""),
    });

    const { year, month } = yearMonthResult.output as v.InferInput<typeof YearMonthSchema>;
    const month0Based = month - 1;
    const collegeIdParam = request.nextUrl.searchParams.get("collegeId");
    const collegeId = parseInt(collegeIdParam ?? "", 10);

    try {
        const defenses = (await prisma.defense.findMany({
            where: {
                startTime: {
                    gte: startOfMonthUTC(new Date(year, month0Based, 15)),
                    lte: endOfMonthUTC(new Date(year, month0Based, 15)),
                },
                collegeId: session.user.role === Role.ADMIN && !isNaN(collegeId) ? collegeId : session.user.collegeId,
            },
            select: {
                id: true,
                title: true,
                startTime: true,
                endTime: true,
                collegeId: true,
                location: {
                    select: {
                        id: true,
                        name: true,
                        mapLink: true,
                    },
                },
            },
            orderBy: {
                startTime: "asc",
            },
        })) as DefenseData[];

        return successResponse(defenses);
    } catch (error) {
        console.error(error);
    }

    return badResponse("Something went wrong retrieving defenses", 500);
}

export async function POST(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;
    try {
        const body = await request.json();
        const { defenseData } = body;
        const validateResult = validateDefense(defenseData);
        if (!validateResult.success) return badResponse(validateResult.issues[0].message, 400);

        const newDefense = await createOrUpdateDefenseAndOrLocation(validateResult.output, session.user.collegeId);
        return successResponse(newDefense, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating defense", 500);
    }
}

export async function PUT(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;
    try {
        const body = await request.json();

        const { defenseData } = body;
        const validateResult = validateDefense(defenseData);
        if (!validateResult.success) return badResponse(validateResult.issues[0].message, 400);

        if (!(await checkCanModifyInCollege(session, CheckType.DEFENSE, defenseData.id, body.collegeId )))
            return badResponse("You are not authorized to update this titulation or it does not exist", 403);

        const newDefense = await createOrUpdateDefenseAndOrLocation(validateResult.output, session.user.collegeId);

        return successResponse(newDefense, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error updating defense", 500);
    }
}

export async function DELETE(request: NextRequest) {
    const { session, response } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return response;
    try {
        const body = await request.json();

        const { defenseId } = body;

        const id = parseInt(defenseId);
        if (isNaN(id)) return badResponse("Invalid defense id", 400);

        if (!(await checkCanModifyInCollege(session, CheckType.DEFENSE, id, body.collegeId )))
            return badResponse("You are not authorized to update this titulation or it does not exist", 403);

        await prisma.defense.delete({
            where: {
                id,
            },
        });
        return successResponse(true, 201);
    } catch (error) {
        console.error(error);
        return badResponse("Error creating defense", 500);
    }
}
