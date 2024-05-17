import { DIFFUSE_SEARCH_SIMILARITY } from "@/app/lib/config";
import prisma from "@/app/lib/db";
import { badResponse, successResponse } from "@/app/utils/util";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    let tags: string[] = parseTags(searchParams.get("tags") || "");
    const filters = {
        q: searchParams.get('q') || undefined,
        tags: searchParams.get('tags') ? searchParams.get('tags')!.split(',').map(decodeURIComponent) : undefined,
        category: searchParams.get('category') || undefined,
        titulation: searchParams.get('titulation') || undefined,
        date: searchParams.get('date') || undefined,
        pages: searchParams.get('pages') || undefined,
        page: searchParams.get('page') || undefined,
        views: searchParams.get('views') || undefined,
    };
    const target = searchParams.get("q") || "";
    const hasTags = tags.length > 0;
    const hasInput = target?.trim() ? true : false;

    if (!hasInput && !hasTags) {
        return badResponse("Search term and tags empty");
    }

    const ILIKE = `%${target.trim().split(/\s+/).join('%')}%`;
    const similarity = target.trim().split(/\s+/).join(" ");

    let query = Prisma.sql`SELECT id, title, thumbnail, description, views, score, pages, "createdAt" FROM "tfg" WHERE `;
    
    let conditions = [];
    if (hasTags) {
        const tagsConditions = Prisma.sql`tags @> ARRAY[${Prisma.join(tags.map(tag => Prisma.sql`${tag}`))}]`;
        conditions.push(tagsConditions);
    }

    if (hasInput) {
        const inputConditions = Prisma.sql`(
            (title ILIKE ${ILIKE} OR word_similarity(title, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
            OR (description ILIKE ${ILIKE} OR word_similarity(description, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
            OR (EXISTS(SELECT 1 FROM unnest(author) as author_unnest WHERE author_unnest ILIKE ${ILIKE}) OR word_similarity(array_to_string(author, ' '), ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
        )`;
        conditions.push(inputConditions);
    }

    query = Prisma.sql`${query} ${Prisma.join(conditions, ' AND ')}
        ORDER BY ${hasInput ? Prisma.sql`word_similarity(title, ${similarity}) DESC` : Prisma.sql`title ASC`}
        LIMIT 30`;
        
    let result = await prisma.$queryRaw`${query}`;
    return successResponse(result);
}

function parseTags(rawTags: string) {
    if (rawTags) {
        try {
            return rawTags.split(',').map(decodeURIComponent)
        } catch {
            return [];
        }
    }
    return [];
}