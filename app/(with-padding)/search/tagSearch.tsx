"use client";
import { SEARCH_INPUT_DELAY } from "@/app/lib/config";
import { Input } from "@nextui-org/input";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { sameArrays } from "@/app/utils/util";
import { SearchParams } from "./page";
interface TagsProps {
    filters: SearchParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function App({filters, updateFilters}: TagsProps) {

    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags ? filters.tags.split(",") : []);
    const handleSearch = useDebouncedCallback((value: string) => {
        if (value.length > 0) {
            fetch("/api/tags?q=" + value)
                .then((res) => res.json())
                .then((data) => {
                    setTags(data.response);
                });
        } else {
            setTags([]);
        }
    }, SEARCH_INPUT_DELAY);

    const selectTag = (tag: string) => {
        setSelectedTags((current) => {
            if (!current.includes(tag)) {
                return [...current, tag];
            } else {
                return current.filter((t) => t !== tag);
            }
        });
    };
    
    useEffect(() => {
        if(selectedTags.length > 0) {
            updateFilters({ tags: selectedTags.map(encodeURIComponent).join(",")});
        } else {
            updateFilters({ tags: undefined});
        }
    }, [selectedTags, updateFilters]);
    useEffect(() => {
        const tags = filters.tags ? filters.tags.split(",").map(decodeURI) : [];
        if (!sameArrays(tags, selectedTags)) {
            setSelectedTags(tags);
        }
    }, [filters]);

    return (
        <div className="pt-1">
            <Input
                onValueChange={(value) => handleSearch(value)}
                spellCheck={false}
                autoFocus
                radius="lg"
                classNames={{
                    input: [
                        "bg-transparent",
                        "text-black/90 dark:text-white/90",
                        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                        "bg-transparent",
                        "dark:bg-transparent",
                        "hover:bg-transparent",
                        "dark:hover:bg-transparent",
                        "group-data-[focus=true]:bg-transparent",
                        "dark:group-data-[focus=true]:bg-transparent",
                        "group-data-[focus=true]:shadow-[none]",
                        "dark:group-data-[focus=true]:shadow-[none]",
                        "!cursor-text",
                        "border-1 border-nova-gray/50",
                    ],
                }}
                endContent={<IconSearch size={20} />}
                style={{ boxShadow: "none" }}
                placeholder="Buscar..."
            />
            <div className="pt-1 gap-1 flex flex-wrap">
                {tags.map((tag, index) => (
                    <button
                        key={index}
                        onClick={() => selectTag(tag)}
                        type="button"
                        className={`text-xs inline-block transition-colors px-4 py-2 lg:px-2 lg:py-1 rounded-[4px] ${
                            selectedTags.includes(tag)
                                ? "bg-cyan-800/40 hover:bg-cyan-400/40"
                                : "bg-slate-400/20 hover:bg-slate-400/50"
                        }`}
                    >
                        <span className="inline-block pr-[1.5px] text-blue-500">
                            #
                        </span>
                        <span className="font-medium">{tag}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
