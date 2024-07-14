import { QueryParams } from "@/app/types/interfaces";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";
import { IconArrowUp } from "@tabler/icons-react";

interface PopularTagsProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
    isDisabled: boolean;
}
export default function SortFilter({
    filters,
    updateFilters,
    isDisabled,
}: PopularTagsProps) {
    const [selected, setSelected] = useState<string>("title");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const handleSelectionChange = (value: string) => {
        if (!value.trim()) {
            return;
        }
        updateFilters({
            sortby: value,
        });
    };
    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
        updateFilters({
            sortorder: newSortOrder,
        });
    };
    useEffect(() => {
        if (filters.sortby) {
            setSelected(filters.sortby);
        }
        if (filters.sortorder) {
            setSortOrder(filters.sortorder);
        }
    }, [filters.sortby, filters.sortorder]);
    return (
        <div className="flex items-stretch gap-1 w-full">
            <Select
                className="bg-transparent outline-none flex-1"
                size="sm"
                isDisabled={isDisabled}
                selectionMode="single"
                variant="underlined"
                labelPlacement="outside-left"
                label={"Ordernar por:"}
                selectedKeys={[selected]}
                onChange={(e) => handleSelectionChange(e.target.value)}
                classNames={{
                    base: "flex items-center h-full",
                    label: "whitespace-nowrap",
                }}
            >
                <SelectItem key="title" value="title">
                    Título
                </SelectItem>
                <SelectItem key="views" value="views">
                    Visitas
                </SelectItem>
                <SelectItem key="pages" value="pages">
                    Páginas
                </SelectItem>
                <SelectItem key="score" value="score">
                    Puntuación
                </SelectItem>
                <SelectItem key="createdAt" value="createdAt">
                    Fecha
                </SelectItem>
            </Select>
            <button
                className={`flex items-center ${isDisabled ? "cursor-default opacity-50" : ""}`}
                onClick={() => {
                    if (!isDisabled) toggleSortOrder();
                }}
                aria-label="Toggle sort order"
            >
                <IconArrowUp
                    size={17}
                    className={`transition-transform  ${
                        sortOrder === "asc" ? "rotate-0" : "rotate-180"
                    }`}
                />
            </button>
        </div>
    );
}
