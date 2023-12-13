'use client'

import {NextUIProvider} from '@nextui-org/system'
import { FavoritesProvider } from './FavoritesContext'

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <FavoritesProvider>
                {children}
            </FavoritesProvider>
        </NextUIProvider>
    )
}