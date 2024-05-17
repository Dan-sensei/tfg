'use client';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface SearchParams {
    q?: string;
    tags?: string;
    category?: string;
    titulation?: string;
    date?: string;
    pages?: string;
    page?: string;
    views?: string;
}

interface SearchContextProps {
    filters: SearchParams;
    updateFilters: (newFilters: Partial<SearchParams>) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export function SearchProvider({children}: { children: React.ReactNode }) {
    const [filters, setFilters] = useState<SearchParams>({});
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const updateFilters = useCallback((newFilters: Partial<SearchParams>) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    }, []);

    useEffect(() => {
        const hasParams = Object.values(filters).some(value => value !== undefined);
        if(!hasParams) {
            replace(`${pathname}`);
            return;
        }
        const definedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, string>);

        const params = new URLSearchParams(definedFilters);

        replace(`${pathname}?${params.toString()}`);
    }, [filters, pathname, replace]);
    
    return (
        <SearchContext.Provider value={{ filters, updateFilters }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = (): SearchContextProps => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};