import { DIFFUSE_SEARCH_SIMILARITY } from "@/app/lib/config";
import prisma from "@/app/lib/db";
import { badResponse, successResponse } from "@/app/utils/util";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const filters = {
        q: searchParams.get("q") || undefined,
        tags: searchParams.get("tags")
            ? searchParams.get("tags")!.split(",").map(decodeURIComponent)
            : undefined,
        category: searchParams.get("category") || undefined,
        titulation: searchParams.get("titulation") || undefined,
        date: searchParams.get("date") || undefined,
        pages: searchParams.get("pages") || undefined,
        page: searchParams.get("page") || undefined,
        views: searchParams.get("views") || undefined,
    };

    const filterFunctions: { [key: string]: (value: any) => Prisma.Sql } = {
        q: getInputQuery,
        tags: getTagsQuery,
        category: getCategoryQuery,
        titulation: getTitulationQuery,
        date: getDateQuery,
        pages: getGenericCondition,
        page: getGenericCondition,
        views: getGenericCondition,
    };
    const queryParts: Prisma.Sql[] = [];
    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
            const filterFunction = filterFunctions[key];
            queryParts.push(filterFunction(value));
        }
    }

    if (queryParts.length === 0) {
        return badResponse("No filters provided");
    }

    let query = Prisma.sql`SELECT id, title, thumbnail, description, views, score, pages, "createdAt" FROM "tfg" WHERE `;

    query = Prisma.sql`${query} ${Prisma.join(queryParts, " AND ")}
        ORDER BY ${Prisma.sql`title ASC`}
        LIMIT 30`;
    let result = await prisma.$queryRaw`${query}`;

    return successResponse(result);
}


function getInputQuery(input: string): Prisma.Sql {
    const ILIKE = `%${input.trim().split(/\s+/).join("%")}%`;
    const similarity = input.trim().split(/\s+/).join(" ");
    return Prisma.sql`(
        (title ILIKE ${ILIKE} OR word_similarity(title, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
        OR (description ILIKE ${ILIKE} OR word_similarity(description, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
        OR (EXISTS(SELECT 1 FROM unnest(author) as author_unnest WHERE author_unnest ILIKE ${ILIKE}) OR word_similarity(array_to_string(author, ' '), ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
    )`;
}
function getTagsQuery(tags: string[]): Prisma.Sql {
    return Prisma.sql`tags @> ARRAY[${Prisma.join(
        tags.map((tag) => Prisma.sql`${tag}`)
    )}]`;
}
function getCategoryQuery(category: string): Prisma.Sql {
    console.log("Filtering by category:", category);
    return Prisma.sql`"categoryId" = ${parseInt(category)}`;
}
function getTitulationQuery(category: string): Prisma.Sql {
    console.log("Filtering by category:", category);
    return Prisma.sql`"titulationId" = ${parseInt(category)}`;
}
function getDateQuery(date: string): Prisma.Sql {
    function parseDate(dateString: string): Date {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
    }

    if (date.startsWith("f")) {
        // "from" date
        const fromDate = date.slice(1); // Remove the "f" prefix
        return Prisma.sql`"createdAt" >= ${parseDate(fromDate)}`;
    } else if (date.startsWith("t")) {
        // "to" date
        const toDate = date.slice(1); // Remove the "t" prefix
        return Prisma.sql`"createdAt" <= ${parseDate(toDate)}`;
    } else if (date.startsWith("r")) {
        // "range" date
        const [startDate, endDate] = date.slice(1).split("t"); // Remove the "r" prefix and split by "t"
        return Prisma.sql`"createdAt" BETWEEN ${parseDate(startDate)} AND ${parseDate(endDate)}`;
    } else {
        throw new Error("Invalid date format");
    }
}
function getGenericCondition(value: any): Prisma.Sql {
    return Prisma.sql``;
}
