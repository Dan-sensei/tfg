import type { Metadata } from "next";
import Footer from "@/app/components/Footer";
import { CategoryLink } from "@/app/types/interfaces";
import prisma from "@/app/lib/db";
import { unstable_cache as cache } from "next/cache";
import { DAY } from "../types/defaultData";
import Navigation from "../components/Navigation";

export const metadata: Metadata = {
    title: "Nova",
    description: "Nova es una plataforma para compartir trabajos finales de grado y másteres",
};

const getPopularCategories = cache(
    async () => {
        const topCategories = (await prisma.$queryRaw`
		SELECT id, name FROM (
			SELECT c.id, c.name, SUM(t.views) as totalViews
			FROM "category" c
			JOIN "tfg" t ON t."categoryId" = c.id
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
    },
    ["popular-categories"],
    {
        revalidate: DAY,
    }
);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const topCategories: CategoryLink[] = await getPopularCategories();

    return (
        <main className="flex flex-col w-full h-full min-h-lvh bg-nova-gradient antialiased overflow-hidden">
            <Navigation categoriesList={topCategories} />
            <section className="bg-grid flex-1 flex">
                <div className="w-full">{children}</div>
            </section>
            <Footer />
        </main>
    );
}
