"use client";
import { DAY } from "@/app/types/defaultData";
import { QueryParams } from "@/app/types/interfaces";
import { getApiRouteUrl, sameArrays } from "@/app/utils/util";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";
type PopularTag = {
    tag: string;
    count: number;
};
interface PopularTagsProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}

export default function PopularTags({
    filters,
    updateFilters,
}: PopularTagsProps) {
    const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>(
        filters.tags ? filters.tags.split(",").map(decodeURI) : []
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (popularTags.length > 0) {
            return;
        }
        const fetchTopTags = () => {
            const url = getApiRouteUrl("top-tags");
            fetch(url, {
                next: {
                    revalidate: DAY,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Not found");
                    }
                    return response.json();
                })
                .then((result) => {
                    if (result.success) {
                        setPopularTags(result.response);
                    }
                })
                .catch(() => {
                    setPopularTags([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };
        fetchTopTags();
    }, []);

    const selectTag = (tag: PopularTag) => {
        const newTags = selectedTags.includes(tag.tag)
            ? selectedTags.filter((t) => t !== tag.tag)
            : [...selectedTags, tag.tag];
        setSelectedTags(newTags);
        if(newTags.length > 0){
            updateFilters({
                tags: newTags.map(encodeURIComponent).join(","),
            });
        }
        else{
            console.log("remove")
            updateFilters({ tags: undefined });
        }
    };

    useEffect(() => {
        const tags = filters.tags ? filters.tags.split(",").map(decodeURI) : [];
        if (!sameArrays(tags, selectedTags)) {
            setSelectedTags(tags);
        }
    }, [filters]);

    return (
        <div
            className={`flex flex-wrap pt-1 ${
                isLoading ? "" : "content-start"
            } gap-1 min-h-[110px]`}
        >
            {isLoading ? (
                <div className="w-full flex justify-center items-center">
                    <Spinner color="primary" />
                </div>
            ) : (
                popularTags.map((tag, index) => (
                    <button
                        key={index}
                        onClick={() => selectTag(tag)}
                        type="button"
                        className={`text-xs inline-block transition-colors   px-4 py-2 lg:px-2 lg:py-1 rounded-[4px]  ${
                            selectedTags.includes(tag.tag)
                                ? "bg-cyan-800/40 hover:bg-cyan-400/40"
                                : "bg-slate-400/20 hover:bg-slate-400/50"
                        }`}
                    >
                        <span className="inline-block pr-[1.5px] text-blue-500">
                            #
                        </span>
                        <span className="font-medium">{tag.tag}</span>
                    </button>
                ))
            )}
        </div>
    );
}
