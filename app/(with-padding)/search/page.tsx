"use client";
import { montserrat } from "@/app/lib/fonts";
import { Input } from "@nextui-org/input";
import { useDebouncedCallback } from "use-debounce";
import { SEARCH_INPUT_DELAY } from "@/app/lib/config";
import { useCallback, useEffect, useState } from "react";
import { Divider } from "@nextui-org/divider";
import PopularTags from "./popularTags";
import TagsSearch from "./tagSearch";
import ActiveFilters from "./activeFilters";
import { getApiRouteUrl } from "@/app/utils/util";
import { iTFG } from "@/app/types/interfaces";
import { useSearch } from "@/app/contexts/SearchContext";
import { usePathname, useRouter } from "next/navigation";

type Props = {
    searchParams: {
        q?: string;
        tags?: string;
        category?: string;
        titulation?: string;
        date?: string;
        pages?: string;
        page?: string;
        views?: string;
    };
};
export default function FullSearch({ searchParams }: Props) {
    const { filters, updateFilters } = useSearch();
    const [results, setResults] = useState<iTFG[]>([]);

    const handleSearch = useDebouncedCallback((value: string) => {
        updateFilters({ q: !value ? undefined : value });
    }, SEARCH_INPUT_DELAY);

    useEffect(() => {
        updateFilters(searchParams);
    }, [searchParams, updateFilters]);

    const fetchResults = useCallback(() => {
        const hasParams = Object.values(filters).some(
            (value) => value !== undefined
        );
        if (!hasParams) {
            setResults([]);
            return;
        }
        const definedFilters = Object.entries(filters).reduce(
            (acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, string>
        );

        const params = new URLSearchParams(definedFilters);
        fetch(getApiRouteUrl("search", params))
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    const TFGS: iTFG[] = result.response;
                    setResults(TFGS);
                } else {
                    console.error(result.response);
                    setResults([]);
                }
            })
            .catch(() => {
                console.log("Error");
            });
    }, [filters]);

    const debouncedFetchResults = useCallback(
        useDebouncedCallback(fetchResults, SEARCH_INPUT_DELAY),
        [fetchResults]
    );
    
    useEffect(() => {
        debouncedFetchResults();
    }, [filters, debouncedFetchResults]);

    return (
        <div className="container mx-auto flex">
            <div className="w-96 bg-black/50 rounded-lg p-4">
                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Popular tags
                    </h2>
                    <PopularTags />
                </section>
                <Divider className="my-4" />
                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Tags
                    </h2>
                    <TagsSearch />
                </section>
                <Divider className="my-4" />

                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Categoria
                    </h2>
                </section>
                <Divider className="my-4" />
                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Titulacion
                    </h2>
                </section>
                <Divider className="my-4" />
                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Fecha
                    </h2>
                </section>
                <Divider className="my-4" />
                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Páginas
                    </h2>
                </section>
                <Divider className="my-4" />
                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Visitas
                    </h2>
                </section>
            </div>
            <div className="flex-1 pl-3">
                <div className="bg-dark rounded-xl p-3">
                    <Input
                        onValueChange={(value) => handleSearch(value)}
                        spellCheck={false}
                        defaultValue={filters.q}
                        autoFocus
                        isClearable
                        radius="lg"
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
                </div>
                <ActiveFilters />
                <div className="w-full pt-3">
                    {results.map((result, index) => (
                        <div key={index}>{result.title}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
