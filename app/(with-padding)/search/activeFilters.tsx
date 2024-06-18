"use client";

import { Category, QueryParams, Titulation } from "@/app/types/interfaces";
import { sameArrays } from "@/app/utils/util";
import { Button } from "@nextui-org/button";
import { IconCalendarMonth, IconCategory, IconEye, IconFile, IconStarFilled, IconTag, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type RemoveButtonProps = {
    background?: string;
    label?: string;
    icon?: JSX.Element;
    update: () => void;
    displayText: string;
};
const RemoveFilterButton = ({ background, label, icon, update, displayText }: RemoveButtonProps) => {
    return (
        <Button
            onClick={() => update()}
            type="button"
            className={`text-xs transition-colors ${
                background || "bg-cyan-800/40 hover:bg-cyan-400/40"
            } h-auto py-2 lg:pl-2 lg:py-1 lg:pr-1 rounded-[4px] inline-flex items-center gap-1`}>
            {icon}
            {label && <span className="uppercase text-[10px] inline-block bg-black/50 rounded-md py-[1.5px] px-1">{label}</span>}

            <span className="font-medium">{displayText}</span>
            <IconX size={14} className="opacity-60" />
        </Button>
    );
};

type RangeLabels = {
    onlyFrom: string;
    onlyTo: string;
    both: string;
};
function getRangeFilter(labels: RangeLabels, from?: string, to?: string) {
    let result = null;

    if (from && !to) {
        return { type: labels.onlyFrom, value: from };
    } else if (!from && to) {
        return { type: labels.onlyTo, value: to };
    } else if (from && to) {
        return { type: labels.both, value: `${from} - ${to}` };
    }

    return result;
}

interface ActiveFiltersProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
    titulations: Titulation[];
    categories: Category[];
}
export default function ActiveFilters({ filters, updateFilters, titulations, categories }: ActiveFiltersProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags ? filters.tags.split(",").map(decodeURI) : []);
    const removeTag = (tag: string) => {
        const newTags = selectedTags.filter((t) => t !== tag);
        setSelectedTags(newTags);
        if (newTags.length > 0) {
            updateFilters({
                tags: newTags.map(encodeURIComponent).join(","),
            });
        } else {
            updateFilters({ tags: undefined });
        }
    };
    const removeFilter = (filter: keyof QueryParams) => {
        updateFilters({ [filter]: undefined });
    };

    useEffect(() => {
        const tags = filters.tags ? filters.tags.split(",").map(decodeURI) : [];
        if (!sameArrays(tags, selectedTags)) {
            setSelectedTags(tags);
        }
    }, [filters]);
    const categoryFilter = categories?.find((c) => c.id == parseInt(filters.category || "-1"))?.name || null;
    const titulationFilter = titulations?.find((c) => c.id == parseInt(filters.titulation || "-1"))?.name || null;
    const dateFilter = getRangeFilter({ onlyFrom: "Desde", onlyTo: "Hasta", both: "Entre" }, filters.fromdate, filters.todate);
    const pagesFilter = getRangeFilter({ onlyFrom: ">", onlyTo: "<", both: "Entre" }, filters.minpages, filters.maxpages);
    const viewsFilter = getRangeFilter({ onlyFrom: ">", onlyTo: "<", both: "Entre" }, filters.minviews, filters.maxviews);
    const scoreFilter = getRangeFilter({ onlyFrom: ">", onlyTo: "<", both: "Entre" }, filters.minscore, filters.maxscore);
    return (
        <div className="pt-1">
            <section className="inline-flex flex-wrap gap-1">
                {selectedTags?.map((tag, index) => (
                    <RemoveFilterButton
                        icon={<IconTag className="opacity-80" size={14} />}
                        key={index}
                        displayText={tag}
                        update={() => removeTag(tag)}
                    />
                ))}
                {categoryFilter && (
                    <RemoveFilterButton
                        background="bg-green-500/50 hover:bg-green-600/50"
                        icon={<IconCategory className="opacity-80" size={14} />}
                        displayText={categoryFilter}
                        update={() => removeFilter("category")}
                    />
                )}
                {titulationFilter && (
                    <RemoveFilterButton
                        background="bg-violet-500/50 hover:bg-violet-600/50"
                        icon={
                            <div className="h-[70%]">
                                <img src="/Icons/Titulation.png" alt="Titulation icon" className="h-full" />
                            </div>
                        }
                        displayText={titulationFilter}
                        update={() => removeFilter("titulation")}
                    />
                )}
                {dateFilter ? (
                    <RemoveFilterButton
                        background="bg-orange-500/50 hover:bg-orange-600/50"
                        label={dateFilter.type}
                        displayText={dateFilter.value}
                        icon={<IconCalendarMonth className="opacity-80" size={14} />}
                        update={() => {
                            removeFilter("fromdate");
                            removeFilter("todate");
                        }}
                    />
                ) : null}
                {pagesFilter ? (
                    <RemoveFilterButton
                        background="bg-red-500/50 hover:bg-red-600/50"
                        label={pagesFilter.type}
                        displayText={pagesFilter.value}
                        icon={<IconFile className="opacity-80" size={14} />}
                        update={() => {
                            removeFilter("minpages");
                            removeFilter("maxpages");
                        }}
                    />
                ) : null}
                {viewsFilter ? (
                    <RemoveFilterButton
                        background="bg-blue-500/50 hover:bg-blue-600/50"
                        label={viewsFilter.type}
                        displayText={viewsFilter.value}
                        icon={<IconEye className="opacity-80" size={14} />}
                        update={() => {
                            removeFilter("minviews");
                            removeFilter("maxviews");
                        }}
                    />
                ) : null}
                {scoreFilter ? (
                    <RemoveFilterButton
                        background="bg-yellow-500/60 hover:bg-yellow-600/60"
                        label={scoreFilter.type}
                        displayText={scoreFilter.value}
                        icon={<IconStarFilled className="opacity-80" size={14} />}
                        update={() => {
                            removeFilter("minscore");
                            removeFilter("maxscore");
                        }}
                    />
                ) : null}
            </section>
        </div>
    );
}
