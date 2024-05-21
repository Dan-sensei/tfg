import { DIFFUSE_SEARCH_SIMILARITY } from "@/app/lib/config";
import prisma from "@/app/lib/db";
import { badResponse, successResponse } from "@/app/utils/util";
import { Prisma } from "@prisma/client";
import {QueryParams} from "@/app/types/interfaces"

type FilterFunction = (params: QueryParams) => Prisma.Sql;

type Filter = {
    requiredParams: (keyof QueryParams)[];
    optionalParams?: (keyof QueryParams)[];
    queryGetter: FilterFunction;
}
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const filterFunctions: { [key: string]: Filter } = {
        q: {
            requiredParams: ["q"],
            queryGetter: ({ q }) => getInputQuery(q!),
        },
        tags: {
            requiredParams: ["tags"],
            queryGetter: ({ tags }) => getTagsQuery(tags!),
        },
        category: {
            requiredParams: ["category"],
            queryGetter: ({ category }) => getCategoryQuery(category!),
        },
        titulation: {
            requiredParams: ["titulation"],
            queryGetter: ({ titulation }) => getTitulationQuery(titulation!),
        },
        date: {
            requiredParams: [],
            optionalParams: ["fromdate", "todate"],
            queryGetter: ({ fromdate, todate }) => getDateQuery(fromdate, todate),
        },
        pages: {
            requiredParams: [],
            optionalParams: ["minpages", "maxpages"],
            queryGetter: ({ minpages, maxpages }) => getPagesQuery(minpages, maxpages),
        },
        views: {
            requiredParams: [],
            optionalParams: ["minviews", "maxviews"],
            queryGetter: ({ minviews, maxviews }) => getViewsQuery(minviews, maxviews),
        },
        score: {
            requiredParams: [],
            optionalParams: ["minscore", "maxscore"],
            queryGetter: ({minscore, maxscore}) => getScoreQuery(minscore, maxscore)
        }
    };
    const queryParts: Prisma.Sql[] = [];

    for (const [key, value] of Object.entries(filterFunctions)) {
        const hasRequiredParams = value.requiredParams.every(param => searchParams.get(param) != undefined);
        const hasOptionalParams = value.optionalParams ? value.optionalParams.some(param => searchParams.get(param) != undefined) : true;

        if (hasRequiredParams && hasOptionalParams) {
            // TODO: validate params
            const params = Object.fromEntries(
                [...value.requiredParams, ...(value.optionalParams || [])]
                    .map(param => [param, searchParams.get(param)])
            );
            queryParts.push(value.queryGetter(params as QueryParams));
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

function getTagsQuery(tags: string): Prisma.Sql {
    const array_tags = tags.split(",").map(decodeURIComponent)
    return Prisma.sql`tags @> ARRAY[${Prisma.join(
        array_tags.map((tag) => Prisma.sql`${tag}`)
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
function getDateQuery(fromDate?: string, toDate?: string): Prisma.Sql {
    function parseDate(dateString: string): Date {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
    }

    if(fromDate && !toDate) {
        return Prisma.sql`"createdAt" >= ${parseDate(fromDate)}`;
    } else if (!fromDate && toDate) {
        return Prisma.sql`"createdAt" <= ${parseDate(toDate)}`;
    } else if (fromDate && toDate) {
        return Prisma.sql`"createdAt" BETWEEN ${parseDate(fromDate)} AND ${parseDate(toDate)}`;
    } else {
        throw new Error("Invalid date format");
    }
}
function getPagesQuery(minPages?: string, maxPages?: string): Prisma.Sql {
    if (minPages && maxPages) {
        return Prisma.sql`"pages" >= ${parseInt(minPages, 10)} AND "pages" <= ${parseInt(maxPages, 10)}`;
    } else if (minPages) {
        return Prisma.sql`"pages" >= ${parseInt(minPages, 10)}`;
    } else if (maxPages) {
        return Prisma.sql`"pages" <= ${parseInt(maxPages, 10)}`;
    } else {
        // Should never get here since either minPages or maxPages is not null
        return Prisma.sql``;
    }
}

function getViewsQuery(minViews?: string, maxViews?: string): Prisma.Sql {
    if (minViews && maxViews) {
        return Prisma.sql`"views" >= ${parseInt(minViews, 10)} AND "views" <= ${parseInt(maxViews, 10)}`;
    } else if (minViews) {
        return Prisma.sql`"views" >= ${parseInt(minViews, 10)}`;
    } else if (maxViews) {
        return Prisma.sql`"views" <= ${parseInt(maxViews, 10)}`;
    } else {
        // Should never get here since either minPages or maxPages is not null
        return Prisma.sql``;
    }
}

function getScoreQuery(minScore?: string, maxScore?: string): Prisma.Sql {
    if (minScore && maxScore) {
        return Prisma.sql`"score" >= ${parseInt(minScore, 10)} AND "score" <= ${parseInt(maxScore, 10)}`;
    } else if (minScore) {
        return Prisma.sql`"score" >= ${parseInt(minScore, 10)}`;
    } else if (maxScore) {
        return Prisma.sql`"score" <= ${parseInt(maxScore, 10)}`;
    } else {
        // Should never get here since either minPages or maxPages is not null
        return Prisma.sql``;
    }
}