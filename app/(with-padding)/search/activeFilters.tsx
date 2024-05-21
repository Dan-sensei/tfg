"use client";

import { QueryParams } from "@/app/types/interfaces";
import { sameArrays } from "@/app/utils/util";
import { useEffect, useState } from "react";

interface ActiveFiltersProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function ActiveFilters({filters, updateFilters}: ActiveFiltersProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>(
        filters.tags ? filters.tags.split(",").map(decodeURI) : []
    );
    const removeTag = (tag: string) => {
        setSelectedTags((current) => current.filter((t) => t !== tag));
    };

    useEffect(() => {
        if (selectedTags.length > 0) {
            updateFilters({
                tags: selectedTags.map(encodeURIComponent).join(","),
            });
        } else {
            updateFilters({ tags: undefined });
        }
    }, [selectedTags, updateFilters]);

    useEffect(() => {
        const tags = filters.tags ? filters.tags.split(",").map(decodeURI) : [];
        if (!sameArrays(tags, selectedTags)) {
            setSelectedTags(tags);
        }
    }, [filters]);

    return (
        <div className="pt-1">
            <section className="inline-flex flex-wrap gap-1">
                {selectedTags?.map((tag, index) => (
                    <button
                        key={index}
                        onClick={() => removeTag(tag)}
                        type="button"
                        className={`text-xs inline-block transition-colors bg-cyan-800/40 hover:bg-cyan-400/40 px-4 py-2 lg:px-2 lg:py-1 rounded-[4px]`}
                    >
                        <span className="inline-block pr-[1.5px] text-blue-500">
                            #
                        </span>
                        <span className="font-medium">{tag}</span>
                    </button>
                ))}
            </section>
        </div>
    );
}
