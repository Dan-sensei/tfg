import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { use, useEffect, useState } from "react";
import { Category, QueryParams } from "@/app/types/interfaces";
import { DAY } from "@/app/types/defaultData";
import { fetchData } from "@/app/utils/fetchData";

interface PopularTagsProps {
    filters: QueryParams;
    categories: Category[];
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function CategoryFilter({
    filters,
    categories,
    updateFilters,
}: PopularTagsProps) {
    const [selected, setSelected] = useState(
        filters.category ? [filters.category] : []
    );
    const handleSelectionChange = (value: string) => {
        if (!value.trim()) {
            return;
        }
        if (value == "-1") {
            setSelected([]);
            updateFilters({
                category: undefined,
            });
        } else {
            updateFilters({
                category: value,
            });
        }
    };
    useEffect(() => {
        if (filters.category) {
            setSelected([filters.category]);
        }
        else{
            setSelected([]);
        }
    }, [filters.category]);
    return (
        <Select
            aria-label="Categorias"
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
                {categories.map((item, i) => (
                    <SelectItem key={item.id} value={item.id} className="capitalize">
                        {item.name}
                    </SelectItem>
                ))}
            </SelectSection>
        </Select>
    );
}
