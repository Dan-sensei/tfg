import { YearMonthSchema } from "@/app/lib/schemas";
import { badResponse, endOfMonthUTC, startOfMonthUTC, successResponse } from "@/app/utils/util";
import { NextRequest } from "next/server";
import * as v from "valibot";
import prisma from "@/app/lib/db";
import { DefenseData } from "@/app/types/interfaces";

export async function GET(request: NextRequest) {
    const yearMonthResult = v.safeParse(YearMonthSchema, {
        year: parseInt(request.nextUrl.searchParams.get("year") ?? ""),
        month: parseInt(request.nextUrl.searchParams.get("month") ?? ""),
    });

    const { year, month } = yearMonthResult.output as v.InferInput<typeof YearMonthSchema>;
    const month0Based = month - 1;
    const collegeIdParam = request.nextUrl.searchParams.get("collegeId");
    let collegeId = parseInt(collegeIdParam ?? "", 10);

    if (isNaN(collegeId)) {
        return badResponse("College ID is not a number", 400);
    }

    try {
        const defenses = (await prisma.defense.findMany({
            where: {
                startTime: {
                    gte: startOfMonthUTC(new Date(year, month0Based, 15)),
                    lte: endOfMonthUTC(new Date(year, month0Based, 15)),
                },
                collegeId: collegeId,
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
