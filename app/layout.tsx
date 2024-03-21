import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Providers } from "./providers";
import { montserrat } from "./components/fonts";
import Footer from "./components/Footer";
import { CategoryLink } from "./types/interfaces";
import prisma from "./lib/db";
import { unstable_cache as cache } from "next/cache";
import { DAY } from "./types/defaultData";

export const metadata: Metadata = {
    title: "Nova",
    description:
        "Nova es una plataforma para compartir trabajos finales de grado y másteres",
};

const getPopularCategories = cache(
    async () => {
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
    },
    ["popular-categories"],
    {
        revalidate: DAY,
    }
);

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const topCategories: CategoryLink[] = await getPopularCategories();

    return (
        <html lang="en" className="dark bg-dark h-full">
            <body
                className={`${montserrat.className} antialiased relative min-h-full flex flex-col`}
            >
                <div className="pb-[150px] flex-1 flex flex-col">
                    <Navigation categoriesList={topCategories} />
                    <section className="pt-[64px] lg:pt-[98px] px-4 md:px-14 flex-1 flex flex-col">
                        <Providers className="flex-1 flex flex-col">
                            {children}
                        </Providers>
                    </section>
                </div>
                <Footer />
            </body>
        </html>
    );
}
