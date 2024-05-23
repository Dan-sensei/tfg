import { Divider } from "@nextui-org/divider";
import { iTFG } from "../types/interfaces";
import React from "react";
import { sanitizeString, formatViews } from "../utils/util";
import Link from "next/link";
import Image from "next/image";
import { Chip } from "@nextui-org/chip";
import { Spinner } from "@nextui-org/spinner";
import { IconCactus, IconEye, IconX } from "@tabler/icons-react";

type ResultListProps = {
    results: iTFG[];
    close: () => void;
};

export function ResultList({ results, close }: ResultListProps) {
    return (
        <>
            {results.map((result, index) => (
                <React.Fragment key={index}>
                    <Divider />
                    <Link
                        onClick={() => close()}
                        href={`/page/${result.id}/${sanitizeString(
                            result.title
                        )}`}
                        className="min-h-16 w-full flex p-2 transition-colors hover:bg-white/10 rounded-md"
                    >
                        <SearchResultRow tfg={result} />
                    </Link>
                </React.Fragment>
            ))}
        </>
    );
}

export function SearchResultRow({ tfg }: { tfg: iTFG }) {
    return (
        <>
            <div className="relative h-16 aspect-video rounded-lg overflow-hidden">
                <Image
                    fill
                    className="object-cover"
                    alt={tfg.title}
                    src={tfg.thumbnail}
                ></Image>
            </div>
            <div className="flex flex-1 pl-2">
                <div className="w-full">
                    <div className="text-sm md:text-base line-clamp-2 md:line-clamp-1">
                        {tfg.title}
                    </div>
                    <div className="text-xs hidden md:block line-clamp-2">
                        {tfg.description}
                    </div>
                    <div className="flex items-center pt-[2px]">
                        <Chip
                            className="bg-nova-button text-xs h-5"
                            variant="solid"
                        >
                            {tfg.pages} páginas
                        </Chip>
                        <div className="text-xs pl-2 font-medium flex items-center text-slate-300">
                            <IconEye size={24} className="inline" />
                            <div className="pl-1">
                                {`${formatViews(tfg.views)} `}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function NoResults({ searchTerm }: { searchTerm: string }) {
    return (
        <div className="h-40 flex items-center justify-center w-full">
            <div className="text-gray-300 text-sm md:text-xl lg:text-sm xl:text-lg text-center">
                <IconX size={70} className="mx-auto stroke-1" />
                No hay resultados para {"'"}
                <span className="text-blue-400">{searchTerm}</span>
                {"'"}
            </div>
        </div>
    );
}

export function Loading() {
    return (
        <div className="h-28 w-full py-3 flex items-center justify-center">
            <Spinner
                classNames={{
                    circle1: "w-10 h-10 border-5",
                    circle2: "w-10 h-10 border-4",
                }}
                color="primary"
            ></Spinner>
        </div>
    );
}
