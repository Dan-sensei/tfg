import { CategoryLink } from "../types/interfaces";
import prisma from "./db";
import { cache } from "react";

export const getPopularCategories = cache(async () => {
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

    return categoryNames;
});
