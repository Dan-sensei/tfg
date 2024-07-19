import Image from "next/image";
import FavButton from "./FavButton";
import { IconStarFilled, IconStarHalfFilled } from "@tabler/icons-react";
import { Chip } from "@nextui-org/chip";
import { iTFG } from "@/app/types/interfaces";
import Link from "next/link";
import { sanitizeString, formatViews } from "../../utils/util";
import { tulpen_one } from "../../lib/fonts";
import Home from "@/app/(with-layout)/home/page";

interface ExtendedTFG extends iTFG {
    className?: string;
}

export default function Card({ id, thumbnail, title, views, score, pages, description, createdAt, className }: ExtendedTFG) {
    let stars: JSX.Element[] = [];

    const score_floor = Math.floor(score);
    for (let i = 0; i < score_floor; i++) {
        stars.push(<IconStarFilled key={i} className="text-yellow-500" size={12} />);
    }
    if (score - score_floor > 0) stars.push(<IconStarHalfFilled key={score_floor} className="text-yellow-500" size={12} />);

    return (
        <div
            key={id}
            className={`${className} relative shadow-light-dark
                transition-all duration-300 delay-0 hover:delay-100
                z-0 hover:z-30 hover:scale-[1.15]
                group flex items-center justify-center`}>
            <div className="w-full rounded-lg">
                <Link
                    href={`/page/${id}/${sanitizeString(title)}`}
                    className="aspect-video block relative w-full z-20 cursor-pointer rounded-lg overflow-hidden">
                    <div
                        className="absolute z-20 bg-black/50 w-full h-full rotate-[20deg] -translate-x-[30%] translate-y-[70%]
                    pointer-events-none opacity-0 invisible transition-all group-hover:visible group-hover:opacity-100 "></div>
                    <div
                        className="absolute z-20 bg-black/30 w-full h-full rotate-[20deg] -translate-x-[25%] translate-y-[69%]
                    pointer-events-none opacity-0 invisible transition-all group-hover:visible group-hover:opacity-100 "></div>
                    <div
                        className={`${tulpen_one.className} text-4xl lg:text-6xl pointer-events-none opacity-0 invisible transition-all group-hover:visible group-hover:opacity-100 absolute z-30 bottom-0 left-2`}>
                        {score}
                        <div className="inline-flex pl-2">{stars}</div>
                    </div>
                    <Image src={thumbnail} alt={title} fill className="absolute border- w-full h-full object-cover" />
                </Link>
                <div
                    className="embla_nodrag z-10 rounded-lg absolute invisible w-full transition-all duration-100 opacity-0 delay-0 shadow-light-dark
                group-hover:delay-75 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible bg-popup -mt-5 pt-5">
                    <div className="w-full p-3">
                        <div className="flex">
                            <h3 className="text-xs lg:text-sm font-bold mb-2 flex-1">{title}</h3>
                            <div className="flex-none">
                                <FavButton id={id} />
                            </div>
                        </div>
                        <div className="flex w-full">
                            <span className="text-xs text-slate-400 font-semibold self-center">
                                {createdAt ? new Date(createdAt).getFullYear() : ""}
                            </span>
                            <span className="hidden lg:inline-block scale-85 self-center">
                                <Chip className="bg-nova-button  text-tiny p-1" variant="solid">
                                    {pages} páginas
                                </Chip>
                            </span>
                            <div className="inline-grid ml-auto pr-2 text-center mb-2 flex-wrap leading-none">
                                <div className="text-yellow-500 text-medium">{formatViews(views)}</div>
                                visitas
                            </div>
                        </div>
                        <p className="text-xs lg:text-sm line-clamp-2 lg:pt-2">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}