import prisma from './db';
import { cache } from 'react'

export const getPopularCategories = cache(async () => {
	const topCategories = (await prisma.$queryRaw`
		SELECT name FROM (
			SELECT c.name, SUM(t.views) as totalViews
			FROM "Category" c
			JOIN "TFG" t ON t."categoryId" = c.id
			GROUP BY c.id
			ORDER BY totalViews DESC
			LIMIT 12
		) AS SubQuery
		ORDER BY name ASC;
	`) as { name: string }[];;

    const categoryNames = topCategories.map(category => category.name);

    return categoryNames;
})