"use client";

import { NextUIProvider } from "@nextui-org/system";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ToasterdProvider } from "./contexts/ToasterContext";
import { CookieConsentProvider } from "./contexts/CookieConsentContext";

type Props = {
    children: React.ReactNode;
    className?: string;
};
export function Providers({ children, className }: Props) {
    return (
        <NextUIProvider locale="es-ES" className={className}>
            <FavoritesProvider>
                <CookieConsentProvider>
                    <ToasterdProvider>{children}</ToasterdProvider>
                </CookieConsentProvider>
            </FavoritesProvider>
        </NextUIProvider>
    );
}
