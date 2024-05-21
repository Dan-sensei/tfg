"use client";
import { QueryParams } from "@/app/types/interfaces";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";

interface PopularTagsProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function PageFilter({
    filters,
    updateFilters,
}: PopularTagsProps) {
    const [minPages, setMinPages] = useState<string>("");
    const [maxPages, setMaxPages] = useState<string>("");
    const preventNegativeNumbers = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val: string | number = parseInt(e.target.value, 10);
        if (isNaN(val)) {
            val = "";
        } else if (val < 0) {
            val = 0;
        }

        if (e.target.name === "minpages") {
            updateFilters({
                minpages: val.toString() || undefined,
            })
            setMinPages(val.toString());
        } else if (e.target.name === "maxpages") {
            updateFilters({
                maxpages: val.toString() || undefined,
            })
            setMaxPages(val.toString());
        }
    };

    useEffect(() => {  
        if (filters.minpages) {
            setMinPages(filters.minpages);
        }
        if (filters.maxpages) {
            setMaxPages(filters.maxpages);
        }
    }, [filters.minpages, filters.maxpages]);


    return (
        <div className="flex items-center pt-2">
            <Input
                type="number"
                variant="bordered"
                label="Desde"
                name="minpages"
                labelPlacement="outside"
                placeholder="0"
                value={minPages}
                onChange={(e) => preventNegativeNumbers(e)}
            />
            <div className="pt-5 px-2">-</div>
            <Input
                type="number"
                variant="bordered"
                label="Hasta"
                name="maxpages"
                labelPlacement="outside"
                value={maxPages}
                placeholder="100"
                onChange={(e) => preventNegativeNumbers(e)}
            />
        </div>
    );
}
