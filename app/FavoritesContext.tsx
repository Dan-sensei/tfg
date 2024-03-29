'use client';
import { createContext, useContext, useEffect, useState, useRef } from 'react';

interface FavoritesContextProps {
    isFavorite: (id: number) => boolean;
    toggleFav: (id: number, flag: boolean) => void;
    getAllLikes: () => number[];
    isInitialized: boolean
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

const getInitialLikes = () => {
    return new Set<number>(Array.from(JSON.parse(localStorage.getItem('favorites') || '{}')));
};

export function FavoritesProvider({children}: { children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false);
    const favValues = useRef<Set<number>>(new Set());
    useEffect(() => {
        favValues.current = getInitialLikes();
        setIsInitialized(true);
    }, []);
    
    const toggleFav = (id: number, flag: Boolean) => {
        flag ? favValues.current.add(id) : favValues.current.delete(id);
        localStorage.setItem('favorites', JSON.stringify(Array.from(favValues.current)));
    };

    const getAllLikes = () => {
        return Array.from(favValues.current);
    }

    const isFavorite = (id: number) => {
        return favValues.current.has(id);
    };
    return (
        <FavoritesContext.Provider value={{ isFavorite, toggleFav, getAllLikes, isInitialized }}>
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