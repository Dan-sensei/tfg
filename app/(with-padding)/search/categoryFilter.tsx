import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { use, useEffect, useState } from "react";
import { Category, QueryParams } from "@/app/types/interfaces";
import { DAY } from "@/app/types/defaultData";
import { fetchData } from "@/app/utils/fetchData";

interface PopularTagsProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function CategoryFilter({
    filters,
    updateFilters,
}: PopularTagsProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [categorias, setCategorias] = useState<Category[]>([]);
    const [selected, setSelected] = useState(
        filters.category ? [filters.category] : []
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
        if (!value.trim() || value == "-1") {
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
    }, [filters.category]);
    return (
        <Select
            aria-label="Categorias"
            isLoading={isLoading}
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
                {categorias.map((item, i) => (
                    <SelectItem key={i} value={item.id} className="capitalize">
                        {item.name}
                    </SelectItem>
                ))}
            </SelectSection>
        </Select>
    );
}
