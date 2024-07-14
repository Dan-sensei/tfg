"use client";
import Card from "@/app/components/home-components/Card";
import { TFGPagination } from "@/app/types/interfaces";
import { getApiRouteUrl } from "@/app/utils/util";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "../contexts/ToasterContext";
import { IconX } from "@tabler/icons-react";

type Props = {
    id: number;
    name: string;
    totalElementsCount: number;
    apiRoute: string;
};

export default function ProjectGrid({ id, name, totalElementsCount, apiRoute }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageData, setPageData] = useState<TFGPagination | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const router = useRouter();
    const { toast } = useToast();
    useEffect(() => {
        const fetchData = (page: number) => {
            const queryParams = new URLSearchParams({
                id: id.toString(),
                totalElements: totalElementsCount.toString(),
                currentPage: page.toString(),
            });
            const urlWithParams = getApiRouteUrl(apiRoute, queryParams);

            fetch(urlWithParams, {
                next: { tags: [`${apiRoute}-${id}`] },
            })
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
        };
        fetchData(currentPage);
    }, [currentPage, router, id]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
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
                    <h1 className="text-lg  mb-3">No hay trabajos que mostrar</h1>
                </div>
            ) : (
                <>
                    <div className="w-full flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold mb-3">{name}</h1>
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
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}
