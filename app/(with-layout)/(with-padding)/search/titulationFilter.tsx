import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { use, useEffect, useState } from "react";
import { Category, QueryParams, Titulation } from "@/app/types/interfaces";
import { DAY } from "@/app/types/defaultData";
import { fetchData } from "@/app/utils/fetchData";

interface PopularTagsProps {
    filters: QueryParams;
    titulations: Titulation[];
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function TitulationFilter({
    filters,
    titulations,
    updateFilters,
}: PopularTagsProps) {
    const [selected, setSelected] = useState<string[]>(
        filters.titulation ? [filters.titulation] : []
    );
    
    const handleSelectionChange = (value: string) => {
        console.log(value)
        if (!value.trim()) {
            return;
        }

        if (value == "-1") {
            setSelected([]);
            updateFilters({
                titulation: undefined,
            });
        } else {
            updateFilters({
                titulation: value,
            });
        }
    };
    useEffect(() => {
        if (filters.titulation) {
            setSelected([filters.titulation]);
        }
        else{
            setSelected([]);
        }
    }, [filters.titulation]);
    return (
        <Select
            aria-label="Titulaciones"
            selectionMode="single"
            placeholder="Seleccionar"
            variant="bordered"
            selectedKeys={selected}
            onChange={(e) => handleSelectionChange(e.target.value)}
        >
            <SelectSection>
                <SelectItem key="-1" value="-1">
                    Limpiar selección
                </SelectItem>
            </SelectSection>
            <SelectSection>
                {titulations.map((item) => (
                    <SelectItem
                        key={item.id}
                        value={item.id}
                        className="capitalize"
                    >
                        {item.name}
                    </SelectItem>
                ))}
            </SelectSection>
        </Select>
    );
}
