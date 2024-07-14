"use client";
import Card from "@/app/components/home-components/Card";
import { TFGPagination } from "@/app/types/interfaces";
import { getApiRouteUrl, getBasePathNameUntilId, sanitizeString } from "@/app/utils/util";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "../contexts/ToasterContext";
import { IconX } from "@tabler/icons-react";
import SortFilter from "../(with-layout)/(with-padding)/search/sortFilter";

type Props = {
    id?: number;
    name: string;
    totalElementsCount: number;
    apiRoute: string;
    defSortBy?: string;
    defOrder?: string;
    showOrderControls?: boolean;
};

export default function ProjectGrid({ id, name, totalElementsCount, apiRoute, defSortBy, defOrder, showOrderControls = true }: Props) {
    const [pageData, setPageData] = useState<TFGPagination | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [pagination, setPagination] = useState({
        currentpage: 1,
        orderby: defSortBy ?? "views",
        order: defOrder ?? "desc",
    });

    const [isFetching, setIsFetching] = useState(true);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { toast } = useToast();

    const updateURL = (params: URLSearchParams) => {
        const path = id ? getBasePathNameUntilId(pathname, id.toString()) : pathname;
        const appendParams = params.size > 0 ? `?${params.toString()}` : "";
        const newUrl = id ? `${path}/${sanitizeString(name)}${appendParams}` : `${path}${appendParams}`;
        window.history.replaceState(null, "", newUrl);
    };

    useEffect(() => {
        updateURL(searchParams);
    }, [pathname, name]);

    useEffect(() => {
        if (!isMounted) return;
        setPagination({
            currentpage: parseInt(searchParams.get("currentpage") || "1"),
            orderby: searchParams.get("sortby") || "views",
            order: searchParams.get("sortorder") || "desc",
        });
    }, [searchParams]);

    useEffect(() => {
        setIsMounted(true);
        const queryParams = new URLSearchParams({
            id: id ? id.toString() : "",
            totalelements: totalElementsCount.toString(),
            currentpage: pagination.currentpage.toString(),
            orderby: pagination.orderby,
            order: pagination.order,
        });
        const urlWithParams = getApiRouteUrl(apiRoute, queryParams);
        fetch(urlWithParams)
            .then((response) => response.json())
            .then((result) => {
                if (result.success) setPageData(result.response);
            })
            .catch(() => {
                setPageData(null);
                toast.error("Se ha producido un error al cargar los datos");
            })
            .finally(() => {
                setIsFetching(false);
            });
    }, [id, pagination]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("currentpage", newPage.toString());
        updateURL(params);
    };
    return (
        <div className="flex flex-wrap h-full flex-col flex-1 py-5 lg:pt-0 pb-10">
            {isFetching ? (
                <div className="w-full flex flex-1 items-center justify-center">
                    <Spinner color="white" />
                </div>
            ) : !pageData ? (
                <div className="w-full flex flex-1 items-center justify-center bg-black/50 rounded-lg  border-1 border-white/5">
                    <div className="text-center">
                        <IconX className="text-nova-red mx-auto" size={50} />
                        <h1 className="text-lg mb-3 text-nova-gray">Se ha producido un error al cargar los datos</h1>
                    </div>
                </div>
            ) : totalElementsCount === 0 ? (
                <div className="w-full flex flex-1 items-center justify-center bg-black/50 rounded-lg  border-1 border-white/5">
                    <h1 className="text-lg mb-3">No hay trabajos que mostrar</h1>
                </div>
            ) : (
                <>
                    <div className="w-full flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold mb-3 flex justify-between">
                            <span className="flex-1">{name}</span>
                            {showOrderControls && (
                                <div className="max-w-full w-72">
                                    <SortFilter
                                        filters={{ sortorder: pagination.order, sortby: pagination.orderby }}
                                        isDisabled={isFetching}
                                        updateFilters={(filters) => {
                                            const { sortorder, sortby } = filters;
                                            const params = new URLSearchParams(searchParams);
                                            if (sortorder) params.set("sortorder", sortorder ?? "");
                                            if (sortby) params.set("sortby", sortby ?? "");
                                            updateURL(params);
                                        }}
                                    />
                                </div>
                            )}
                        </h1>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
                            {pageData.tfgs.map((tfg, i) => {
                                return (
                                    <Card
                                        key={i}
                                        id={tfg.id}
                                        createdAt={tfg.createdAt}
                                        thumbnail={tfg.thumbnail}
                                        title={tfg.title}
                                        description={tfg.description}
                                        pages={tfg.pages}
                                        views={tfg.views}
                                        score={tfg.score}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    {pageData.totalPages > 1 && (
                        <Pagination
                            color="primary"
                            className="self-end mx-auto mb-3 pt-10"
                            showControls
                            total={pageData.totalPages}
                            initialPage={1}
                            page={pagination.currentpage}
                            onChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}
