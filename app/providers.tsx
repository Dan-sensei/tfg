"use client";

import { NextUIProvider } from "@nextui-org/system";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ToasterdProvider } from "./contexts/ToasterContext";

type Props = {
    children: React.ReactNode;
    className?: string;
};
export function Providers({ children, className }: Props) {
    return (
        <NextUIProvider locale="es-ES" className={className}>
            <FavoritesProvider>
                <ToasterdProvider>{children}</ToasterdProvider>
            </FavoritesProvider>
        </NextUIProvider>
    );
}
