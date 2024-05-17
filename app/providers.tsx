"use client";

import { NextUIProvider } from "@nextui-org/system";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { SearchProvider } from "./contexts/SearchContext";

type Props = {
    children: React.ReactNode;
    className?: string;
};
export function Providers({ children, className }: Props) {
    return (
        <NextUIProvider className={className}>
            <FavoritesProvider>
                <SearchProvider>{children}</SearchProvider>
            </FavoritesProvider>
        </NextUIProvider>
    );
}
