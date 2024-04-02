"use client";
import { useEffect, useRef, useState } from "react";
import { IconSearch, IconEye, IconX } from "@tabler/icons-react";
import { Button } from "@nextui-org/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/modal";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { useDebouncedCallback } from "use-debounce";
import { SEARCH_INPUT_DELAY } from "../lib/config";
import { iTFG } from "../types/interfaces";
import { getPopularTags } from "../lib/actions/tfg";
import Image from "next/image";
import Link from "next/link";
import { Chip } from "@nextui-org/chip";
import { formatViews, sanitizeString } from "../utils/util";
import { Spinner } from "@nextui-org/spinner";
import { Loading, NoResults, ResultList } from "./SearchComponents";

type PopularTag = {
    tag: string;
    count: number;
};

export default function Search() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [results, setResults] = useState<iTFG[]>([]);
    const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const firstUpdate = useRef(true);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "F" && event.shiftKey) {
                event.preventDefault();
                onOpen();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        getPopularTags().then((response) => {
            const TAGS: PopularTag[] = JSON.parse(response);
            setPopularTags(TAGS);
        });

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSearch = useDebouncedCallback((value: string) => {
        setSearchTerm(value);
    }, SEARCH_INPUT_DELAY);

    useEffect(() => {
        // Skip first render
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        const performSearch = (hasInput: boolean, hasTags: boolean) => {
            const params = new URLSearchParams();
            if (hasInput) params.set("query", searchTerm);
            if (hasTags)
                params.set(
                    "tags",
                    encodeURIComponent(JSON.stringify(selectedTags))
                );
            fetch(`/api/search?${params.toString()}`)
                .then((response) => response.json())
                .then((result) => {
                    if (result.success) {
                        const TFGS: iTFG[] = result.data;
                        setResults(TFGS);
                    } else {
                        setResults([]);
                    }
                })
                .catch(() => {
                    console.log("Error");
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        const hasInput = searchTerm.trim() !== "";
        const hasTags = selectedTags.length > 0;

        if (!hasInput && !hasTags) {
            setResults([]);
            return;
        }
        setLoading(true);
        performSearch(hasInput, hasTags);
    }, [searchTerm, selectedTags]);

    const selectTag = (tag: PopularTag) => {
        if (!selectedTags.find((t) => t === tag.tag)) {
            setSelectedTags((current) => [...current, tag.tag]);
        }
    };
    const removeSelectedTag = (tag: string) => {
        setSelectedTags((current) => current.filter((t) => t !== tag));
    };

    const showSpinner = loading;
    const showNoResults =
        !loading &&
        results?.length === 0 &&
        (searchTerm.trim() !== "" || selectedTags.length > 0);
    const showResults = !loading && results?.length > 0;

    return (
        <>
            <Button
                onClick={onOpen}
                radius="full"
                className="group bg-nova-darker-2/50 "
            >
                <div className="duration-500 w-40 group-hover:w-44 flex">
                    <div className="mr-auto flex items-center">
                        <IconSearch className="text-slate-400 pointer-events-none" />
                        <div className="pl-2 group-hover:tracking-wider duration-500">
                            Buscar...
                        </div>
                    </div>
                    <Kbd keys={["shift"]} className="bg-nova-darker-2 ml-auto">
                        F
                    </Kbd>
                </div>
            </Button>
            <Modal
                size="5xl"
                isOpen={isOpen}
                placement={"top-center"}
                classNames={{
                    base: "bg-black/90 backdrop-blur-sm transition-all",
                    header: "pb-1",
                }}
                scrollBehavior="inside"
                closeButton={<></>}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex-wrap">
                                <div className="flex gap-3 w-full">
                                    <div className="flex grow">
                                        <Input
                                            onValueChange={(value) =>
                                                handleSearch(value)
                                            }
                                            spellCheck={false}
                                            defaultValue={searchTerm}
                                            autoFocus
                                            isClearable
                                            radius="lg"
                                            classNames={{
                                                input: [
                                                    "bg-transparent",
                                                    "text-black/90 dark:text-white/90",
                                                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                                                    "text-lg",
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
                                                ],
                                            }}
                                            style={{ boxShadow: "none" }}
                                            placeholder="Búsqueda..."
                                        />
                                    </div>
                                    <div>
                                        <Kbd className="bg-nova-light-dark ml-auto">
                                            ESC
                                        </Kbd>
                                    </div>
                                </div>
                                <div className="w-full px-2 ">
                                    {selectedTags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {selectedTags.map((tag, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        removeSelectedTag(tag)
                                                    }
                                                    type="button"
                                                    className="text-xs inline-flex items-center transition-colors bg-blue-600/80 hover:bg-blue-500 pl-4 pr-3 py-2 lg:pl-2 lg:pr-1 lg:py-[2px] rounded-[4px] relative"
                                                >
                                                    <span className="inline-block pr-[1.5px]">
                                                        #
                                                    </span>
                                                    <span className="font-medium">
                                                        {tag}
                                                    </span>
                                                    <IconX
                                                        className="text-white/50 inline-block ml-1"
                                                        size={12}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="w-full px-2 flex items-center flex-wrap gap-1 pt-2">
                                    <span className="text-xs inline-block">
                                        Tags populares:
                                    </span>
                                    {popularTags.map((tag, index) => (
                                        <button
                                            key={index}
                                            onClick={() => selectTag(tag)}
                                            type="button"
                                            className={`text-xs inline-block transition-colors bg-slate-400/20 hover:bg-slate-400/50 px-4 py-2 lg:px-2 lg:py-1 rounded-[4px]  ${
                                                selectedTags.find(
                                                    (t) => t === tag.tag
                                                )
                                                    ? "hidden"
                                                    : ""
                                            }`}
                                        >
                                            <span className="inline-block pr-[1.5px] text-blue-500">
                                                #
                                            </span>
                                            <span className="font-medium">
                                                {tag.tag}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-wrap gap-1 overflow-y-auto">
                                    {loading && <Loading />}
                                    {showNoResults && (
                                        <NoResults searchTerm={searchTerm} />
                                    )}
                                    {showResults && (
                                        <ResultList results={results} />
                                    )}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
