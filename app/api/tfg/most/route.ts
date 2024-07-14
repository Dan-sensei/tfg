import { getAllPaginatedProjects } from "@/app/lib/apiPaginationHelper";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return await getAllPaginatedProjects(
        request.nextUrl.searchParams.get("totalelements"),
        request.nextUrl.searchParams.get("currentpage"),
        request.nextUrl.searchParams.get("orderby"),
        request.nextUrl.searchParams.get("order"),
    );
}