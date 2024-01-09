import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Providers } from "./providers";
import prisma from "./utils/db";
import { cache } from 'react'
import { getPopularCategories } from "./utils/popular";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Nova",
    description:
        "Nova es una plataforma para compartir trabajos finales de grado y másteres",
};


export const revalidate = 3600

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
	const topCategories = await getPopularCategories();
    return (
        <html lang="en" className="dark bg-dark">
            <body className={inter.className}>
                <Navigation categoriesList={topCategories} />
                <section className="pt-[100px]">
                    <Providers>{children}</Providers>
                </section>
                <footer className="bg-dark text-white text-center py-3">
                    <p>© 2021 Nova</p>
                </footer>
            </body>
        </html>
    );
}
