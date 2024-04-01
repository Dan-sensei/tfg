"use client";
import { useEffect, useState } from "react";
import { IconSearch, IconEye } from "@tabler/icons-react";
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

type PopularTag = {
    tag: string;
    count: number;
};

export default function Search() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [results, setResults] = useState<iTFG[]>([]);
    const [popularTags, setPopularTags] = useState<PopularTag[]>([]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "F" && event.shiftKey) {
                event.preventDefault();
                onOpen();
            }
        };

        window.onkeydown = handleKeyDown;
        const pTags = getPopularTags().then((response) => {
            const TAGS = JSON.parse(response);
            setPopularTags(TAGS);
        });

        return () => {
            window.onkeydown = null;
        };
    }, []);

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams();
        params.set("query", value);

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
            });
    }, SEARCH_INPUT_DELAY);

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
                    base: "bg-black/90 backdrop-blur-sm",
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
                                            onChange={(event) =>
                                                handleSearch(event.target.value)
                                            }
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
                                <div className="w-full px-2 flex items-center flex-wrap gap-1 pt-2">
                                    <span className="text-xs inline-block">
                                        Popular tags:
                                    </span>
                                    {popularTags.map((tag, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="text-xs inline-block bg-slate-400/20 hover:bg-slate-400/50 px-4 py-2 lg:px-2 lg:py-1 rounded-md"
                                        >
                                            {tag.tag}
                                        </button>
                                    ))}
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-wrap gap-1 overflow-y-auto">
                                    {results?.map((result, index) => (
                                        <>
                                            <Divider
                                                key={`div-${index}`}
                                                className=""
                                            />
                                            <Link
                                                key={index}
                                                href={`/page/${
                                                    result.id
                                                }/${sanitizeString(
                                                    result.title
                                                )}`}
                                                className="min-h-16 w-full flex p-2 transition-colors hover:bg-white/10 rounded-md"
                                            >
                                                <div className="relative h-16 aspect-video rounded-lg overflow-hidden">
                                                    <Image
                                                        fill
                                                        className="object-cover"
                                                        alt={result.title}
                                                        src={result.thumbnail}
                                                    ></Image>
                                                </div>
                                                <div className="flex flex-1 pl-2">
                                                    <div className="w-full">
                                                        <div className="text-sm md:text-base line-clamp-2 md:line-clamp-1">
                                                            {result.title}
                                                        </div>
                                                        <div className="text-xs hidden md:block line-clamp-2">
                                                            {result.description}
                                                        </div>
                                                        <div className="flex items-center pt-[2px]">
                                                            <Chip
                                                                className="bg-nova-button text-xs h-5"
                                                                variant="solid"
                                                            >
                                                                {result.pages}{" "}
                                                                páginas
                                                            </Chip>
                                                            <div className="text-xs pl-2 font-medium flex items-center text-slate-300">
                                                                <IconEye
                                                                    size={24}
                                                                    className="inline"
                                                                />
                                                                <div className="pl-1">
                                                                    {`${formatViews(
                                                                        result.views
                                                                    )} `}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </>
                                    ))}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
