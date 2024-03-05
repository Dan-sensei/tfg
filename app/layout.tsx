import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Providers } from "./providers";
import { getPopularCategories } from "./utils/popular";
import { montserrat } from "./components/fonts";
import Footer from "./components/Footer";
import { CategoryLink } from "./types/interfaces";

export const metadata: Metadata = {
    title: "Nova",
    description:
        "Nova es una plataforma para compartir trabajos finales de grado y másteres",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const topCategoriesString = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/categories?type=popular`,
        {
            next: { revalidate: 12 * 3600 },
        }
    );

    const topCategories: CategoryLink[] = await topCategoriesString.json();

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
