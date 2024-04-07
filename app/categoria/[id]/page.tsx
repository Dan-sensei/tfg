"use client";
import Card from "@/app/components/home-components/Card";
import { TFGPagination } from "@/app/types/interfaces";
import { getApiRouteUrl } from "@/app/utils/util";
import { Pagination } from "@nextui-org/pagination";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Categoria({ params }: { params: { id: string } }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<TFGPagination | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = (page: number) => {
            const queryParams = new URLSearchParams({
                target: params.id,
                page: String(page),
                pageSize: "30",
            });
            const urlWithParams = getApiRouteUrl("category", queryParams);

            if (!params.id) {
                return;
            }
            fetch(urlWithParams, {
                next: { tags: [`category${params.id}`] }
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Not found");
                }
                return response.json();
            })
                .then((result) => {
                    if(result.success){
                        setData(result.response);
                    }
                })
                .catch(() => {
                    router.push("/categoria");
                });
        };
        fetchData(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (!data) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-wrap flex-1 py-5 lg:pt-0">
            <div className="w-full">
                <h1 className="text-2xl font-bold mb-3">{data.title}</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
                    {data.tfgs.map((tfg, i) => {
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
            <Pagination
                color="primary"
                className="self-end mx-auto mb-3 pt-10"
                showControls
                total={data.totalPages}
                initialPage={1}
                page={currentPage}
                onChange={handlePageChange}
            />
        </div>
    );
}
