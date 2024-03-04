import prisma from "@/app/lib/db";
import { CategoryLink } from "@/app/types/interfaces";

// Get all categories
const getAll = async () => {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
    return JSON.stringify(categories);
};

// Get most popular categories based on tfg views
const popular = async () => {
    const topCategories = (await prisma.$queryRaw`
		SELECT id, name FROM (
			SELECT c.id, c.name, SUM(t.views) as totalViews
			FROM "Category" c
			JOIN "TFG" t ON t."categoryId" = c.id
			GROUP BY c.id
			ORDER BY totalViews DESC
			LIMIT 12
		) AS SubQuery
		ORDER BY name ASC;
	`) as { id: string; name: string }[];

    const categoryNames: CategoryLink[] = topCategories.map((category) => {
        return { id: category.id, name: category.name };
    });

    return JSON.stringify(categoryNames);
};

interface RequestHandler {
    [key: string]: () => Promise<string>;
}

export async function GET(request: Request) {
    const requests: RequestHandler = {
        "all": getAll,
        "popular": popular,
    };

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";
    
    const solver = requests[type];
    if (!solver) {
        return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const result = await solver();
    
    return new Response(result, {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
