'use client';
import { createContext, useContext, useEffect, useState, useRef } from 'react';

interface FavoritesContextProps {
    isFavorite: (id: number) => Boolean;
    toggleFav: (id: number, flag: Boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

const getInitialLikes = () => {
    return new Set<number>(Array.from(JSON.parse(localStorage.getItem('favorites') || '{}')));
};

export function FavoritesProvider({children}: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const favValues = useRef(favorites);
    useEffect(() => {
        const newFavorites = getInitialLikes();
        setFavorites(newFavorites);
        favValues.current = newFavorites;
    }, []);
    
    const toggleFav = (id: number, flag: Boolean) => {
        flag ? favValues.current.add(id) : favValues.current.delete(id);
        localStorage.setItem('favorites', JSON.stringify(Array.from(favValues.current)));
    };

    const isFavorite = (id: number): Boolean => {
        return favValues.current.has(id);
    };
    return (
        <FavoritesContext.Provider value={{ isFavorite, toggleFav }}>
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