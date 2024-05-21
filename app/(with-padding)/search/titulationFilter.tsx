import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { use, useEffect, useState } from "react";
import { Category, QueryParams, Titulation } from "@/app/types/interfaces";
import { DAY } from "@/app/types/defaultData";
import { fetchData } from "@/app/utils/fetchData";

interface PopularTagsProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function TitulationFilter({
    filters,
    updateFilters,
}: PopularTagsProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [titulations, setTitulations] = useState<Titulation[]>([]);
    const [selected, setSelected] = useState<string[]>(
        filters.titulation ? [filters.titulation] : []
    );
    useEffect(() => {
        const fetchTopTags = () => {
            fetchData("titulations", null, DAY)
                .then((result) => {
                    if (result.success) {
                        setTitulations(result.response);
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
    }, [filters.titulation]);
    return (
        <Select
            aria-label="Titulaciones"
            className="max-w-xs"
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
