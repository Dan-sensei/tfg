"use client";

import Card from "../../../components/home-components/Card";
import { Pagination } from "@nextui-org/pagination";
import { useEffect, useState } from "react";
import { TFGPagination } from "../../../types/interfaces";
import { Spinner } from "@nextui-org/spinner";
import { getApiRouteUrl } from "../../../utils/util";
import { unstable_noStore as noStore } from 'next/cache';
export default function Trending() {
    noStore();
    const [data, setData] = useState<TFGPagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = (page: number) => {
            const queryParams = new URLSearchParams({
                currentpage: page.toString()
            });
            const urlWithParams = getApiRouteUrl("trending", queryParams);

            fetch(urlWithParams)
                .then((response) => response.json())
                .then((result) => {
                    if (result.success) {
                        setData(result.response);
                    }
                })
                .catch(() => {
                    console.log("Error");
                });
        };
        fetchData(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (!data) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner
                    classNames={{
                        circle1: "w-16 h-16 border-5",
                        circle2: "w-16 h-16 border-4",
                    }}
                    color="primary"
                ></Spinner>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap flex-1 py-5 lg:pt-0">
            <div className="w-full">
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
