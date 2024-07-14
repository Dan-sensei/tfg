import { NextRequest } from "next/server";
import { getPaginatedProjectsFilteredByFor } from "@/app/lib/apiPaginationHelper";

export async function GET(request: NextRequest) {
    return await getPaginatedProjectsFilteredByFor(
        "categoryId",
        request.nextUrl.searchParams.get("id"),
        request.nextUrl.searchParams.get("totalelements"),
        request.nextUrl.searchParams.get("currentpage"),
        request.nextUrl.searchParams.get("orderby"),
        request.nextUrl.searchParams.get("order"),
    );
}
