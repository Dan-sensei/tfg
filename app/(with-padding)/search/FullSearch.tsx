"use client";
import { montserrat } from "@/app/lib/fonts";
import { Input } from "@nextui-org/input";
import { useDebouncedCallback } from "use-debounce";
import { SEARCH_INPUT_DELAY } from "@/app/lib/config";
import { useCallback, useEffect, useState } from "react";

import ActiveFilters from "./activeFilters";
import { getApiRouteUrl } from "@/app/utils/util";
import { QueryParams, iTFG } from "@/app/types/interfaces";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Card from "@/app/components/home-components/Card";
import { Button } from "@nextui-org/button";
import { IconSearch, IconX } from "@tabler/icons-react";
import CategoryFilter from "./categoryFilter";
import TitulationFilter from "./titulationFilter";
import DateFilter from "./dateFilter";
import PageFilter from "./pageFilter";
import ViewsFilter from "./viewsFilter";
import PopularTags from "./popularTags";
import { Divider } from "@nextui-org/divider";
import TagsSearch from "./tagFilter";
import { Loading } from "@/app/components/SearchComponents";

const createDefinedFilters = (
    filters: Record<string, any>
): URLSearchParams => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined) {
            params.append(key, filters[key]);
        }
    });
    return params;
};
const hasParams = (filters: QueryParams) => {
    const hasParams = Object.values(filters).some(
        (value) => value !== undefined
    );
    return hasParams;
};

export default function FullSearch() {
    const [filters, setFilters] = useState<QueryParams>({});
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState<iTFG[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();

    const paramKeys: Array<keyof QueryParams> = [
        "q",
        "tags",
        "category",
        "titulation",
        "fromdate",
        "todate",
        "minpages",
        "maxpages",
        "minviews",
        "maxviews",
        "minscore",
        "maxscore",
    ];

    const updateFilters = useCallback((newFilters: Partial<QueryParams>) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    }, []);
    useEffect(() => {
        const params: QueryParams = Object.fromEntries(
            paramKeys.map((key) => [key, searchParams.get(key) || undefined])
        );

        updateFilters(params);
    }, [searchParams]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        updateFilters({ q: !value ? undefined : value });
    };

    const fetchResults = useCallback(() => {
        const params = createDefinedFilters(filters);
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
        if (!hasParams(filters)) {
            if (results.length > 0) setResults([]);
            return;
        }
        setIsLoading(true);
        debouncedFetchResults();
    }, [filters, debouncedFetchResults]);

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };
    useEffect(() => {
        const handleResize = () => {
            // 1024 = lg breakpoint
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (filters.q) {
            setSearchValue(filters.q);
        }
    }, [filters.q]);

    const ready = !isLoading && !hasParams(filters);
    const showNoResults =
        !isLoading && results?.length === 0 && hasParams(filters);
    const showResults = !isLoading && results?.length > 0 && hasParams(filters);

    return (
        <>
            <div className="lg:container 2xl:max-w-[1800px] mx-auto flex h-full pb-10 pt-5 lg:pt-0">
                <div
                    className={`lg:w-[340px] bg-content1 lg:bg-black/50 lg:rounded-lg transition-transform lg:transition-none h-full overflow-y-auto fixed lg:relative lg:z-50 top-0 left-0 w-screen max-w-md ${
                        isSidebarOpen
                            ? "translate-x-[0]"
                            : "translate-x-[-100%] lg:translate-x-[unset]"
                    }`}
                >
                    <div className="absolute top-0 left-0 right-0 bottom-0 p-4">
                        <Button
                            title="close"
                            className="lg:hidden w-7 h-7 flex items-center justify-center px-0 min-w-0 absolute top-3 right-3"
                            variant="bordered"
                            size="sm"
                            radius="full"
                            onPress={() => handleCloseSidebar()}
                        >
                            <IconX size={15} />
                        </Button>
                        <div className="pb-10">
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
                                <CategoryFilter
                                    filters={filters}
                                    updateFilters={updateFilters}
                                />
                            </section>
                            <Divider className="my-4" />
                            <section>
                                <h2
                                    className={`${montserrat.className} font-semibold pb-1`}
                                >
                                    Titulacion
                                </h2>
                                <TitulationFilter
                                    filters={filters}
                                    updateFilters={updateFilters}
                                />
                            </section>
                            <Divider className="my-4" />
                            <section>
                                <h2
                                    className={`${montserrat.className} font-semibold pb-1`}
                                >
                                    Fecha
                                </h2>
                                <DateFilter
                                    filters={filters}
                                    updateFilters={updateFilters}
                                />
                            </section>
                            <Divider className="my-4" />
                            <section>
                                <h2
                                    className={`${montserrat.className} font-semibold pb-1`}
                                >
                                    Número de páginas
                                </h2>
                                <PageFilter
                                    filters={filters}
                                    updateFilters={updateFilters}
                                />
                            </section>
                            <Divider className="my-4" />
                            <section>
                                <h2
                                    className={`${montserrat.className} font-semibold pb-1`}
                                >
                                    Visitas
                                </h2>
                                <ViewsFilter
                                    filters={filters}
                                    updateFilters={updateFilters}
                                />
                            </section>
                        </div>
                    </div>
                </div>

                <div className="flex-1 pl-3 flex flex-col">
                    <div className="flex gap-2 items-center">
                        <Button
                            className="h-full block lg:hidden"
                            color="primary"
                            onPress={handleSidebarToggle}
                        >
                            {" "}
                            Filtros{" "}
                        </Button>
                        <div className="bg-dark rounded-xl p-2 flex-1">
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
                        </div>
                    </div>
                    <ActiveFilters
                        filters={filters}
                        updateFilters={updateFilters}
                    />

                    <div className="w-full mt-3 p-3 flex-1 bg-black/50 rounded-lg  min-h-[300px]">
                        {ready && (
                            <div className="h-full w-full flex items-center justify-center">
                                <IconSearch
                                    size={120}
                                    className=" opacity-50"
                                />
                            </div>
                        )}
                        {isLoading && (
                            <div className="h-full w-full flex items-center justify-center">
                                <Loading />
                            </div>
                        )}
                        {showNoResults && (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="text-gray-300 text-sm md:text-xl lg:text-sm xl:text-lg text-center">
                                    <IconX
                                        size={70}
                                        className="mx-auto stroke-1"
                                    />
                                    No hay resultados
                                </div>
                            </div>
                        )}
                        {showResults && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full  ">
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
                        )}
                    </div>
                </div>
            </div>
            <div
                className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 ${
                    isSidebarOpen ? "open" : "hidden"
                }`}
                onClick={handleCloseSidebar}
            ></div>
        </>
    );
}
