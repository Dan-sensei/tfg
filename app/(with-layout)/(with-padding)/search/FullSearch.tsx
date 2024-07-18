"use client";
import { montserrat } from "@/app/lib/fonts";
import { useDebouncedCallback } from "use-debounce";
import { SEARCH_INPUT_DELAY } from "@/app/lib/config";
import { useCallback, useEffect, useState } from "react";

import ActiveFilters from "./activeFilters";
import { getApiRouteUrl, sanitizeString } from "@/app/utils/util";
import { Category, PopularTag, QueryParams, Titulation, iTFG } from "@/app/types/interfaces";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { Loading, SearchResultRow } from "@/app/components/SearchComponents";
import SearchFilter from "./searchFilter";
import SortFilter from "./sortFilter";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Link from "next/link";
import ScoreFilter from "./scoreFilter";
import { Pagination } from "@nextui-org/pagination";

const createDefinedFilters = (filters: Record<string, any>): URLSearchParams => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined) {
            params.append(key, filters[key]);
        }
    });
    return params;
};
const hasParams = (filters: QueryParams) => {
    const nonTriggeringParams = ["sortby", "sortorder"];
    const hasParams = Object.entries(filters).some(([key, value]) => value !== undefined && !nonTriggeringParams.includes(key));
    return hasParams;
};

type SearchProps = {
    categories: Category[];
    popular_tags: PopularTag[];
    titulations: Titulation[];
};

export default function FullSearch({ categories, popular_tags, titulations }: SearchProps) {
    const [filters, setFilters] = useState<QueryParams>({});
    const [results, setResults] = useState<iTFG[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const [totalPages, setTotalPages] = useState(1);

    const updateFilters = useCallback((newFilters: Partial<QueryParams>) => {
        console.log(newFilters);
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    }, []);

    useEffect(() => {
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
            "orderby",
            "orderdirection",
            "currentpage",
        ];
        const params: QueryParams = Object.fromEntries(paramKeys.map((key) => [key, searchParams.get(key) || undefined]));
        updateFilters(params);
    }, [searchParams, updateFilters]);

    const fetchResults = useCallback(() => {
        const params = createDefinedFilters(filters);
        fetch(getApiRouteUrl("search", params))
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                if (result.success) {
                    const TFGS: iTFG[] = result.response.tfgs;
                    setTotalPages(result.response.totalPages);
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
    const debouncedFetchResults = useDebouncedCallback(fetchResults, SEARCH_INPUT_DELAY);

    useEffect(() => {
        console.log(results)
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
            if (window.innerWidth >= 1024 && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isSidebarOpen]);

    const ready = !isLoading && !hasParams(filters);
    const showNoResults = !isLoading && results?.length === 0 && hasParams(filters);
    const showResults = !isLoading && results?.length > 0 && hasParams(filters);

    function handlePageChange(page: number): void {
        updateFilters({ currentpage: page.toString() });
    }

    return (
        <>
            <div className="lg:container 2xl:max-w-[1800px] mx-auto flex h-full pb-10 pt-5 lg:pt-0  min-h-[300px]">
                <div
                    className={`lg:w-[340px] bg-content1 lg:bg-black/50 lg:rounded-lg transition-transform lg:transition-none h-full fixed lg:relative z-[100] lg:z-0 top-0 left-0 w-screen max-w-md ${
                        isSidebarOpen ? "translate-x-[0]" : "translate-x-[-100%] lg:translate-x-[unset]"
                    }`}>
                    <div className="absolute top-0 left-0 right-0 bottom-0 py-2 px-1">
                        <SimpleBar autoHide={false} className="h-full p-3">
                            <div className="pr-2">
                                <Button
                                    title="close"
                                    className="lg:hidden w-7 h-7 flex items-center justify-center px-0 min-w-0 absolute top-3 right-3"
                                    variant="bordered"
                                    size="sm"
                                    radius="full"
                                    onClick={() => handleCloseSidebar()}>
                                    <IconX size={15} />
                                </Button>
                                <div className="pb-10">
                                    <section>
                                        <h2 className={`${montserrat.className} font-semibold pb-1`}>Popular tags</h2>
                                        <PopularTags popularTags={popular_tags} filters={filters} updateFilters={updateFilters} />
                                    </section>
                                    <Divider className="my-4" />
                                    <section>
                                        <h2 className={`${montserrat.className} font-semibold pb-1`}>Tags</h2>
                                        <TagsSearch filters={filters} updateFilters={updateFilters} />
                                    </section>
                                    <Divider className="my-4" />
                                    <section>
                                        <h2 className={`${montserrat.className} font-semibold pb-1`}>Categoria</h2>
                                        <CategoryFilter categories={categories} filters={filters} updateFilters={updateFilters} />
                                    </section>
                                    <Divider className="my-4" />
                                    <section>
                                        <h2 className={`${montserrat.className} font-semibold pb-1`}>Titulacion</h2>
                                        <TitulationFilter titulations={titulations} filters={filters} updateFilters={updateFilters} />
                                    </section>
                                    <Divider className="my-4" />
                                    <section>
                                        <h2 className={`${montserrat.className} font-semibold pb-1`}>Fecha</h2>
                                        <DateFilter filters={filters} updateFilters={updateFilters} />
                                    </section>
                                    <Divider className="my-4" />
                                    <section>
                                        <h2 className={`${montserrat.className} font-semibold pb-1`}>Número de páginas</h2>
                                        <PageFilter filters={filters} updateFilters={updateFilters} />
                                    </section>
                                    <Divider className="my-4" />
                                    <section>
                                        <h2 className={`${montserrat.className} font-semibold pb-1`}>Visitas</h2>
                                        <ViewsFilter filters={filters} updateFilters={updateFilters} />
                                    </section>
                                    <Divider className="my-4" />
                                    <section>
                                        <h2 className={`${montserrat.className} font-semibold pb-1`}>Puntuación</h2>
                                        <ScoreFilter filters={filters} updateFilters={updateFilters} />
                                    </section>
                                </div>
                            </div>
                        </SimpleBar>
                    </div>
                </div>
                <div
                    className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 ${isSidebarOpen ? "open" : "hidden"}`}
                    onClick={handleCloseSidebar}></div>
                <div className="flex-1 lg:pl-3 flex flex-col">
                    <div className="flex gap-2 items-center">
                        <Button
                            className="h-full block lg:hidden"
                            color="primary"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event from reaching the overlay
                                handleSidebarToggle();
                            }}>
                            {" "}
                            Filtros{" "}
                        </Button>
                        <div className="bg-dark rounded-xl p-2 flex-1">
                            <SearchFilter filters={filters} updateFilters={updateFilters} />
                        </div>
                    </div>
                    <ActiveFilters categories={categories} titulations={titulations} filters={filters} updateFilters={updateFilters} />
                    <div className="h-10 pt-1 ml-auto flex items-center w-64 bg-black/50 rounded-t-lg px-3">
                        <SortFilter isDisabled={!showResults} filters={filters} updateFilters={updateFilters} />
                    </div>
                    <div className="w-full p-3 flex-1 flex-col flex bg-black/50 rounded-lg rounded-tr-none min-h-[300px] relative">
                        <div className="flex flex-1 relative">
                            {ready && (
                                <div className="h-full w-full flex items-center justify-center">
                                    <IconSearch size={120} className=" opacity-50" />
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
                                        <IconX size={70} className="mx-auto stroke-1" />
                                        No hay resultados
                                    </div>
                                </div>
                            )}
                            {showResults && (
                                <>
                                    <div className="absolute top-0 left-0 right-0 bottom-0 py-2 px-1">
                                        <SimpleBar autoHide={false} className="h-full pl-3 pt-2 pr-4">
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-1 w-full">
                                                {results.map((tfg, index) => (
                                                    <Link
                                                        key={index}
                                                        href={`/page/${tfg.id}/${sanitizeString(tfg.title)}`}
                                                        className="min-h-16 w-full flex p-2 transition-colors hover:bg-white/10 rounded-md">
                                                        <SearchResultRow tfg={tfg} />
                                                    </Link>
                                                ))}
                                            </div>
                                        </SimpleBar>
                                    </div>
                                </>
                            )}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                color="primary"
                                className="mx-auto pt-4"
                                showControls
                                total={totalPages}
                                initialPage={1}
                                page={parseInt(filters.currentpage || "") ?? 1}
                                onChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
