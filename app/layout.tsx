import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Providers } from "./providers";
import { montserrat } from "./lib/fonts";
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
        <html lang="en" className="dark">
            <body
                className={`${montserrat.className} bg-gradient-to-bl from-nova-dark via-nova-darker to-nova-darker antialiased min-h-lvh flex flex-col`}
            >
                <Navigation categoriesList={topCategories} />
                <section className="pt-[66px] bg-grid lg:pt-[87px] px-4 xl:px-14 flex-1 flex">
                    <Providers className="flex grow flex-wrap w-full">
                        <div className="w-full">
                            {children}
                        </div>
                    </Providers>
                </section>
                <Footer />
            </body>
        </html>
    );
}
