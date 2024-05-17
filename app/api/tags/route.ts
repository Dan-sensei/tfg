import prisma from "@/app/lib/db";
import { badResponse, getValidLimit, successResponse } from "@/app/utils/util";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = getValidLimit(searchParams.get("limit"), 15, 20);
    const skip = getValidLimit(searchParams.get("limit"), 0, 20);
    let searchQuery = searchParams.get("q") || '';
  
    if(searchQuery === '') {
        /*
        const tags = (await prisma.$queryRaw`SELECT DISTINCT unnest(tags) AS tag
        FROM "tfg"
        ORDER BY tag
        LIMIT 10`) as Array<{ tag: string }>;
        return successResponse(tags.map(row => row.tag));
        */
        return badResponse('Search term empty', 400);
    }
    const exactSearchQuery = searchQuery.trim().split(/\s+/).join(' '); // Prepare exact match string
    searchQuery = `%${exactSearchQuery.replaceAll(' ', '%')}%`; // Prepare ILIKE match string
    try {
        const tags = (await prisma.$queryRaw`SELECT DISTINCT tag,
        CASE WHEN tag = ${exactSearchQuery} THEN 1 ELSE 2 END AS priority
        FROM (
            SELECT unnest(tags) AS tag
            FROM "tfg"
        ) AS subquery
        WHERE tag ILIKE ${searchQuery}
        ORDER BY priority, tag
        LIMIT ${limit}
        `) as Array<{ tag: string }>;
        ;

        const resultTags = tags.map(row => row.tag);

        return successResponse(resultTags);
    } catch (error) {
        console.error('Request error', error);
        return badResponse('Something went wrong', 500);
    }
}