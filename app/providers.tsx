'use client'

import {NextUIProvider} from '@nextui-org/system'
import { FavoritesProvider } from './FavoritesContext'

type Props = {
    children: React.ReactNode,
    className?: string
}
export function Providers({children, className}: Props) {
    return (
        <NextUIProvider className={className}>
            <FavoritesProvider>
                {children}
            </FavoritesProvider>
        </NextUIProvider>
    )
}