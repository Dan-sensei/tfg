import { getValidLimit, successResponse } from "@/app/utils/util";
import prisma from "@/app/lib/db";
import { POPULAR_TAGS_DISPLAY } from "@/app/lib/config";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = getValidLimit(searchParams.get("limit"), 10, 20);
    const popularTags = await prisma.$queryRaw<Array<{ tag: string; count: BigInt }>>`
        SELECT unnest(tags) as tag, COUNT(*) as count
        FROM "tfg"
        GROUP BY tag
        ORDER BY count DESC
        LIMIT ${limit}
    `;

    const serializedTags = popularTags.map(tag => ({
        ...tag,
        count: tag.count.toString(),
    }));

    return successResponse(serializedTags);
}
