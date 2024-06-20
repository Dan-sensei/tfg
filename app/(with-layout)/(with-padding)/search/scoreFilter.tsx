"use client";
import { QueryParams } from "@/app/types/interfaces";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";

interface PopularTagsProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function ScoreFilter({ filters, updateFilters }: PopularTagsProps) {
    const [minScore, setMinScore] = useState<string>("");
    const [maxScore, setMaxScore] = useState<string>("");
    const preventNegativeNumbers = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val: string | number = parseFloat(e.target.value);
        if (isNaN(val)) {
            val = "";
        } else if (val < 0) {
            val = 0;
        }
        else if(val > 5){
            val = 5;
        }

        if (e.target.name === "minscore") {
            updateFilters({
                minscore: val.toString() || undefined,
            });
            setMinScore(val.toString());
        } else if (e.target.name === "maxscore") {
            updateFilters({
                maxscore: val.toString() || undefined,
            });
            setMaxScore(val.toString());
        }
    };

    useEffect(() => {
        setMinScore(filters.minscore ?? "");
        setMaxScore(filters.maxscore ?? "");
    }, [filters.minscore, filters.maxscore]);

    return (
        <div className="flex items-center pt-2">
            <Input
                type="number"
                variant="bordered"
                label="Desde"
                name="minscore"
                labelPlacement="outside"
                placeholder="0.00"
                step={"0.01"}
                value={minScore}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={(e) => preventNegativeNumbers(e)}
            />
            <div className="pt-5 px-2">-</div>
            <Input
                type="number"
                variant="bordered"
                label="Hasta"
                name="maxscore"
                labelPlacement="outside"
                value={maxScore}
                placeholder="5.00"
                step={"0.01"}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={(e) => preventNegativeNumbers(e)}
            />
        </div>
    );
}
