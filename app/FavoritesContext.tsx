'use client';
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

interface FavoritesContextProps {
    favorites: Set<number>;
    add_remove: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export function FavoritesProvider({children}: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    useEffect(() => {
        const favoritesStorage = localStorage.getItem('favorites');
        if(favoritesStorage) {
            setFavorites(new Set(Array.from(JSON.parse(favoritesStorage))));
        }
    }, []);
    const saveFavoritesToLocalStorage = (newFavorites: Set<number>) => {
        localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
    };
    const favoritesReturn: FavoritesContextProps = {
        favorites: favorites,
        add_remove: (id: number) => {
            let newFavorites = null;
            if(favorites.has(id)) {
                favorites.delete(id)
                newFavorites = new Set(favorites);
            }
            else{
                newFavorites = new Set(favorites.add(id));
            }
            setFavorites(newFavorites);
            saveFavoritesToLocalStorage(newFavorites)
        }
    };

    return (
        <FavoritesContext.Provider value={favoritesReturn}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = (): FavoritesContextProps => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a LocalStorageProvider');
    }
    return context;
};