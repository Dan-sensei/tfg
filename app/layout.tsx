import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { montserrat } from "./lib/fonts";
import SessionProvider from "./components/SessionProvider";

export const metadata: Metadata = {
    title: "Nova",
    description: "Nova es una plataforma para compartir trabajos finales de grado y másteres",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${montserrat.className} min-h-lvh`}>
                <Providers className="flex grow flex-wrap w-full">
                    <SessionProvider>{children}</SessionProvider>
                </Providers>
            </body>
        </html>
    );
}
