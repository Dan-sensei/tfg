import { DIFFUSE_SEARCH_SIMILARITY } from "@/app/lib/config";
import prisma from "@/app/lib/db";
import { badResponse, successResponse } from "@/app/utils/util";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    
    let tags: string[] = [];
    const tagsRaw = searchParams.get("tags");
    if (tagsRaw) {
        try {
            tags = JSON.parse(decodeURIComponent(tagsRaw));
        } catch {
            tags = [];
        }
    }
    const target = searchParams.get("query") || "";
    const hasTags = tags.length > 0;
    const hasInput = target?.trim() ? true : false;
    if (!hasInput && !hasTags) {
        return badResponse("Search term and tags empty");
    }
    const parts = target.trim().split(/\s+/);
    let ILIKE = "";
    parts.forEach((part) => {
        ILIKE += `%${part}`;
    });
    ILIKE += "%";
    let similarity = parts.join(" ")
    let result;
    console.log(ILIKE);
    console.log(hasInput + " " + hasTags)
    if (hasInput && hasTags) {
        result = await prisma.$queryRaw`
        SELECT id, title, thumbnail, description, views, score, pages, "createdAt" FROM "TFG"
        WHERE tags @> ARRAY[${tags}] AND (
            (title ILIKE ${ILIKE} OR word_similarity(title, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
            OR (author ILIKE ${ILIKE} OR word_similarity(author, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
            OR (description ILIKE ${ILIKE} OR word_similarity(description, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
        )
        ORDER BY word_similarity(title, ${similarity}) DESC LIMIT 30
    `;
    } else if(hasInput) {
        result = await prisma.$queryRaw`
        SELECT id, title, thumbnail, description, views, score, pages, "createdAt" FROM "TFG"
        WHERE
            (title ILIKE ${ILIKE} OR word_similarity(title, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
            OR (author ILIKE ${ILIKE} OR word_similarity(author, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
            OR (description ILIKE ${ILIKE} OR word_similarity(description, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
        ORDER BY word_similarity(title, ${similarity}) DESC LIMIT 30
    `;
    } else {
        result = await prisma.$queryRaw`
        SELECT id, title, thumbnail, description, views, score, pages, "createdAt" FROM "TFG"
        WHERE tags @> ARRAY[${tags}]
        ORDER BY title ASC 
        LIMIT 30`;
    }

    return successResponse(result);
}
