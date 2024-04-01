import { DIFFUSE_SEARCH_SIMILARITY } from "@/app/lib/config";
import prisma from "@/app/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get("query");
    if (!target?.trim()) {
        return new Response(JSON.stringify({ success: false, error: "Search term is empty" }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const parts = target.trim().split(/\s+/);
    let ILIKE = "";
    parts.forEach((part) => {
        ILIKE += `%${part}`;
    });
    ILIKE += "%";
    let similarity = parts.join(' ');
    const result = await prisma.$queryRaw`SELECT id, title,thumbnail, description, views, score, pages, "createdAt" FROM "TFG"
        WHERE (title  ILIKE ${ILIKE} OR word_similarity(title , ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
        OR (author ILIKE ${ILIKE} OR word_similarity(author, ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
        OR (description  ILIKE ${ILIKE} OR word_similarity(description , ${similarity}) > ${DIFFUSE_SEARCH_SIMILARITY})
        ORDER BY word_similarity(title, ${similarity}) DESC
        LIMIT 30`;
    
    return new Response(JSON.stringify({success: true, data: result}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}