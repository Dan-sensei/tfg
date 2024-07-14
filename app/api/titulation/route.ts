import prisma from "@/app/lib/db";
import { tfgFields } from "@/app/types/prismaFieldDefs";
import { badResponse, successResponse } from "@/app/utils/util";
import { PAGINATION_SIZE } from "@/app/types/defaultData";
import { TFGStatus } from "@/app/lib/enums";
import * as v from "valibot";
import { PaginationSchema } from "@/app/lib/schemas";
import { NextRequest } from "next/server";
import { getPaginatedDataFor } from "@/app/lib/apiPaginationHelper";

export async function GET(request: NextRequest) {
    return await getPaginatedDataFor(
        request.nextUrl.searchParams.get("currentPage"),
        request.nextUrl.searchParams.get("totalElements"),
        request.nextUrl.searchParams.get("id"),
        "titulationId"
    );
}
