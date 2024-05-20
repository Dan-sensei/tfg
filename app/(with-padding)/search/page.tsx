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
import { Category, iTFG } from "@/app/types/interfaces";
import { usePathname, useRouter } from "next/navigation";
import Card from "@/app/components/home-components/Card";
//import Sidebar from "@/app/components/Sidebar";
import { DAY } from "@/app/types/defaultData";
import CategoryFilter from "./categoryFilter";
import TitulationFilter from "./titulationFilter";

type Props = {
    searchParams?: SearchParams;
};

export interface SearchParams {
    q?: string;
    tags?: string;
    category?: string;
    titulation?: string;
    date?: string;
    pages?: string;
    page?: string;
    views?: string;
}
const createDefinedFilters = (
    filters: Record<string, any>
): URLSearchParams => {
    const definedFilters = Object.entries(filters).reduce(
        (acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        },
        {} as Record<string, string>
    );
    return new URLSearchParams(definedFilters);
};

export default function FullSearch({ searchParams }: Props) {
    const [filters, setFilters] = useState<SearchParams>({});
    const [results, setResults] = useState<iTFG[]>([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const { replace } = useRouter();

    const updateFilters = useCallback((newFilters: Partial<SearchParams>) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    }, []);

    const handleSearch = useDebouncedCallback((value: string) => {
        updateFilters({ q: !value ? undefined : value });
    }, SEARCH_INPUT_DELAY);

    useEffect(() => {
        if (searchParams) updateFilters(searchParams);
    }, [searchParams, updateFilters]);

    const fetchResults = useCallback(() => {
        const hasParams = Object.values(filters).some(
            (value) => value !== undefined
        );
        if (!hasParams) {
            setResults([]);
            return;
        }
        const params = createDefinedFilters(filters);
        setIsLoading(true);
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
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [filters]);

    

    // Update params in url
    useEffect(() => {
        const params = createDefinedFilters(filters);
        replace(`${pathname}?${params.toString()}`);
    }, [filters, pathname, replace]);

    // Avoid problems when changing filters too fast
    const debouncedFetchResults = useCallback(
        useDebouncedCallback(fetchResults, SEARCH_INPUT_DELAY),
        [fetchResults]
    );

    useEffect(() => {
        debouncedFetchResults();
    }, [filters, debouncedFetchResults]);

    return (
        <div className="container 2xl:max-w-[1800px] mx-auto flex">
            <div className="w-80 bg-black/50 rounded-lg p-4">
                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Popular tags
                    </h2>
                    <PopularTags
                        filters={filters}
                        updateFilters={updateFilters}
                    />
                </section>
                <Divider className="my-4" />
                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Tags
                    </h2>
                    <TagsSearch
                        filters={filters}
                        updateFilters={updateFilters}
                    />
                </section>
                <Divider className="my-4" />

                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Categoria
                    </h2>
                    <CategoryFilter filters={filters} updateFilters={updateFilters} />
                </section>
                <Divider className="my-4" />
                <section>
                    <h2
                        className={`${montserrat.className} font-semibold pb-1`}
                    >
                        Titulacion
                    </h2>
                    <TitulationFilter filters={filters} updateFilters={updateFilters} />
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
                <ActiveFilters
                    filters={filters}
                    updateFilters={updateFilters}
                />

                <div className="w-full pt-3">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
                        {results.map((tfg, index) => (
                            <Card
                                key={index}
                                id={tfg.id}
                                createdAt={tfg.createdAt}
                                thumbnail={tfg.thumbnail}
                                title={tfg.title}
                                description={tfg.description}
                                pages={tfg.pages}
                                views={tfg.views}
                                score={tfg.score}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
