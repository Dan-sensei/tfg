"use client";
import { useEffect, useRef, useState } from "react";
import {
    IconAdjustmentsSearch,
    IconSearch,
} from "@tabler/icons-react";
import { Button } from "@nextui-org/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@nextui-org/modal";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { useDebouncedCallback } from "use-debounce";
import {  SEARCH_INPUT_DELAY } from "../lib/config";
import { iTFG } from "../types/interfaces";
import Link from "next/link";
import { Loading, NoResults, ResultList } from "./SearchComponents";
import { getApiRouteUrl } from "../utils/util";

export default function QuickSearch() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [results, setResults] = useState<iTFG[]>([]);
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
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSearch = useDebouncedCallback((value: string) => {
        setSearchTerm(value);
    }, SEARCH_INPUT_DELAY);

    useEffect(() => {
        // Skip on first render
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        const performSearch = (hasInput: boolean) => {
            const params = new URLSearchParams();
            if (hasInput) params.set("query", searchTerm);
            fetch(getApiRouteUrl("search", params))
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    const TFGS: iTFG[] = result.response;
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

        if (!hasInput) {
            setResults([]);
            return;
        }
        setLoading(true);
        performSearch(hasInput);
    }, [searchTerm]);

    const showNoResults = !loading && results?.length === 0 && searchTerm.trim() !== "";
    const showResults = !loading && results?.length > 0 && searchTerm.trim() !== "";

    return (
        <>
            <div className="rounded-full flex gap-1">
                <Button
                    onClick={onOpen}
                    radius="full"
                    className="group bg-nova-darker-2/50 hidden lg:block"
                >
                    <div className="duration-500 w-40 group-hover:w-44 flex">
                        <div className="mr-auto flex items-center">
                            <img
                                src="/Icons/QuickSearch.png"
                                alt="Quick Search"
                            ></img>
                            <div className="pl-2 text-xs group-hover:tracking-wider duration-500">
                                Búsqueda...
                            </div>
                        </div>
                        <Kbd
                            keys={["shift"]}
                            className="bg-nova-darker-2 ml-auto"
                        >
                            F
                        </Kbd>
                    </div>
                </Button>
                <Button
                    as={Link}
                    href="/search"
                    className="h-[40px] flex items-center px-4 min-w-0 bg-transparent lg:bg-nova-darker-2/50 "
                    radius="full"
                >
                    <IconAdjustmentsSearch className="stroke-1 hidden lg:block" />
                    <IconSearch className="stroke-1 block lg:hidden" />
                </Button>
            </div>
            <Modal
                size="5xl"
                isOpen={isOpen}
                placement={"top"}
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
                                    <div className="flex flex-1">
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
