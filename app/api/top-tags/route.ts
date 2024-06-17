import { getValidLimit, successResponse } from "@/app/utils/util";
import prisma from "@/app/lib/db";
import { POPULAR_TAGS_DISPLAY } from "@/app/lib/config";

export async function GET(request: Request) {
    

    return successResponse(serializedTags);
}
