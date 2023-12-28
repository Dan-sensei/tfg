import Image from "next/image"
import FavButton from "./FavButton";
import { Chip } from "@nextui-org/chip";
import { iTFG } from "@/app/types/interfaces";

interface ExtendedTFG extends iTFG {
    updateCallback?: () => void;
    className: string;
}

export default function Card({id, thumbnail, title, pages, description, createdAt, updateCallback, className}: ExtendedTFG) {
    return (
        <div key={id} className={`${className} relative 
                transition-all duration-300 delay-0 hover:delay-100
                z-0 hover:z-30 hover:scale-[1.2] hover:-translate-y-10 hover:shadow-xl-d
                group flex items-center justify-center`}>
            <div className="w-full rounded-lg">
                <div className="aspect-video relative w-full z-20 cursor-pointer">
                    <Image 
                    src={thumbnail} 
                    alt={title} 
                    fill
                    className="rounded-lg absolute border- w-full h-full object-cover" />
                </div>
                
                <div className="z-10 rounded-lg absolute invisible w-full transition-all group-hover:shadow-xl-d duration-300 opacity-0 delay-0 
                group-hover:delay-75 group-hover:opacity-100 group-hover:visible bg-popup -mt-5 pt-5">
                    <div className="w-full p-3">
                        <div className="flex">
                            <h3 className="text-sm font-bold mb-2 flex-1">{title}</h3>
                            <div className="flex-none">
                                <FavButton id={id} updateCallback={updateCallback} />
                            </div>
                        </div>
                        <span className="text-xs text-slate-400 font-semibold">
                        </span>
                        <span className="inline-block scale-85 text-lg">
                            <Chip color="secondary" variant="solid">{pages} páginas</Chip>
                        </span>
                        <p className="text-sm line-clamp-2 pt-2">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}