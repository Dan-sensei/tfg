"use client";

import { QueryParams } from "@/app/types/interfaces";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";

interface PopularTagsProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}

export default function SearchFilter({filters, updateFilters}: PopularTagsProps) {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (value: string) => {
        setSearchValue(value);
        updateFilters({ q: !value ? undefined : value });
    };
    useEffect(() => {
        if (filters.q) {
            setSearchValue(filters.q);
        }
    }, [filters.q]);
    
    return (
        <Input
            onValueChange={(value) => handleSearch(value)}
            spellCheck={false}
            autoFocus
            isClearable
            radius="lg"
            value={searchValue}
            classNames={{
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    "text-lg",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "bg-transparent",
                    "dark:bg-transparent",
                    "hover:bg-transparent",
                    "dark:hover:bg-transparent",
                    "group-data-[focus=true]:bg-transparent",
                    "dark:group-data-[focus=true]:bg-transparent",
                    "group-data-[focus=true]:shadow-[none]",
                    "dark:group-data-[focus=true]:shadow-[none]",
                    "!cursor-text",
                ],
            }}
            style={{ boxShadow: "none" }}
            placeholder="Búsqueda..."
        />
    );
}
function updateFilters(arg0: { q: string | undefined; }) {
    throw new Error("Function not implemented.");
}

