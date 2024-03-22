"use client";

import Card from "../components/Card";
import { PAGE_SIZE } from "../lib/config";
import { Pagination } from "@nextui-org/pagination";
import { useEffect, useState } from "react";
import { TFGPagination } from "../types/interfaces";
import { getTrending } from "../lib/actions/trending";

export default function Trending() {
    const [data, setData] = useState<TFGPagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = (page: number) => {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                pageSize: PAGE_SIZE.toString(),
            });
            const urlWithParams = `${
                process.env.NEXT_PUBLIC_API_BASE_URL
            }api/trending?${queryParams.toString()}`;

            getTrending(page, PAGE_SIZE)
                .then((response) => {
                    const result = JSON.parse(response);
                    if (result.success) {
                        setData(result.data);
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
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-wrap flex-1 pt-6">
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
                color="secondary"
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
