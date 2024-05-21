"use client";
import { QueryParams } from "@/app/types/interfaces";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";

interface PopularTagsProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function ViewsFilter({
    filters,
    updateFilters,
}: PopularTagsProps) {
    const [minViews, setMinViews] = useState<string>("");
    const [maxViews, setMaxViews] = useState<string>("");
    const preventNegativeNumbers = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val: string | number = parseInt(e.target.value, 10);
        if (isNaN(val)) {
            val = "";
        } else if (val < 0) {
            val = 0;
        }

        if (e.target.name === "minviews") {
            updateFilters({
                minviews: val.toString() || undefined,
            })
            setMinViews(val.toString());
        } else if (e.target.name === "maxviews") {
            updateFilters({
                maxviews: val.toString() || undefined,
            })
            setMaxViews(val.toString());
        }
    };

    useEffect(() => {  
        if (filters.minviews) {
            setMinViews(filters.minviews);
        }
        if (filters.maxviews) {
            setMaxViews(filters.maxviews);
        }
    }, [filters.minviews, filters.maxviews]);


    return (
        <div className="flex items-center pt-2">
            <Input
                type="number"
                variant="bordered"
                label="Desde"
                name="minviews"
                labelPlacement="outside"
                placeholder="0"
                value={minViews}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={(e) => preventNegativeNumbers(e)}
            />
            <div className="pt-5 px-2">-</div>
            <Input
                type="number"
                variant="bordered"
                label="Hasta"
                name="maxviews"
                labelPlacement="outside"
                value={maxViews}
                placeholder="100"
                onWheel={(e) => e.currentTarget.blur()}
                onChange={(e) => preventNegativeNumbers(e)}
            />
        </div>
    );
}
