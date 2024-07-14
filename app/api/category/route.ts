import { NextRequest } from "next/server";
import { getPaginatedDataFor } from "@/app/lib/apiPaginationHelper";

export async function GET(request: NextRequest) {
    return await getPaginatedDataFor(
        request.nextUrl.searchParams.get("currentPage"),
        request.nextUrl.searchParams.get("totalElements"),
        request.nextUrl.searchParams.get("id"),
        "categoryId"
    );
}
