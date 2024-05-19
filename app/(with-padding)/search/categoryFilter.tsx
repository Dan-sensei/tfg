import { Select, SelectItem } from "@nextui-org/select";
import { use, useEffect, useState } from "react";
import { SearchParams } from "./page";
import { Category } from "@/app/types/interfaces";
import { DAY } from "@/app/types/defaultData";
import { fetchData } from "@/app/utils/fetchData";

interface PopularTagsProps {
    filters: SearchParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function CategoryFilter({
    filters,
    updateFilters,
}: PopularTagsProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [categorias, setCategorias] = useState<Category[]>([]);
    const [selected, setSelected] = useState(
        filters.category
    );
    useEffect(() => {
        const fetchTopTags = () => {
            fetchData("categories", null, DAY)
                .then((result) => {
                    if (result.success) {
                        setCategorias(result.response);
                    }
                })
                .catch(() => {
                    console.error("Error al obtener las categorias");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };
        fetchTopTags();
    }, []);

    const handleSelectionChange = (value: string) => {
        if(!value.trim()) {
            updateFilters({
                category: undefined,
            });
            return;
        };
        updateFilters({
            category: value,
        });
    };
    useEffect(() => {
        if(filters.category) {
            setSelected(filters.category);
        }
    }, [filters.category]);
    return (
        <Select
            aria-label="Categorias"
            className="max-w-xs"
            isLoading={isLoading}
            selectionMode="single"
            placeholder="Seleccionar"
            variant="bordered"
            selectedKeys={selected}
            onChange={(e) => handleSelectionChange(e.target.value)}
        >
            {categorias.map((item, i) => (
                <SelectItem key={i} value={item.id} className="capitalize">
                    {item.name}
                </SelectItem>
            ))}
        </Select>
    );
}
