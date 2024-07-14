"use client";
import Card from "@/app/components/home-components/Card";
import { PAGINATION_SIZE } from "@/app/types/defaultData";
import { TFGPagination } from "@/app/types/interfaces";
import { getApiRouteUrl } from "@/app/utils/util";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Categoria({ params }: { params: { id: string } }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageData, setPageData] = useState<TFGPagination | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isNaN(parseInt(params.id))) {
            router.push("/categoria");
            return;
        }

        const fetchData = (page: number) => {
            const queryParams = new URLSearchParams({
                categoryId: params.id,
                currentPage: String(page),
            });
            const urlWithParams = getApiRouteUrl("category", queryParams);

            if (!params.id) {
                return;
            }
            fetch(urlWithParams, {
                next: { tags: [`category${params.id}`] },
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.success) setPageData(result.response);
                })
                .catch(() => {
                    router.push("/categoria");
                });
        };
        fetchData(currentPage);
    }, [currentPage, router, params.id]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="flex flex-wrap h-full flex-col flex-1 py-5 lg:pt-0 pb-10">
            {!pageData ? (
                <div className="w-full flex flex-1 items-center justify-center">
                    <Spinner color="white" />
                </div>
            ) : pageData.totalElements === 0 ? (
                <div className="w-full flex flex-1 items-center justify-center bg-black/50 rounded-lg  border-1 border-white/5">
                    <h1 className="text-lg  mb-3">No hay trabajos para esta categoría</h1>
                </div>
            ) : (
                <>
                    <div className="w-full flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold mb-3">{pageData.title}</h1>
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
                    {pageData.tfgs.length > PAGINATION_SIZE && (
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
