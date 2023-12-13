import { Button } from "@nextui-org/button";
import prisma from "../utils/db";
import Image from "next/image"
import {Chip} from "@nextui-org/chip";
import FavButton from "./FavButton";

async function getRecents() {
    const recents = await prisma.tFG.findMany({
        select: {
            id: true,
            thumbnail: true,
            title: true,
            description: true,
            views: true,
            score: true,
            pages: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 6
    });
    
    return recents
}


export default async function RecentlyAdded() {
    const tfgs = await getRecents();
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-5 gap-5">
            {
            tfgs.map((tfg) => (
                <div key={tfg.id} className="first:origin-left last:origin-right relative 
                transition-all duration-300 delay-0 hover:delay-100
                z-0 hover:z-30 hover:scale-[1.3] hover:-translate-y-10 hover:shadow-xl-d
                group flex items-center justify-center">
                    <div className="w-full rounded-lg">
                        <div className="aspect-video relative w-full z-20 cursor-pointer">
                            <Image 
                            src={tfg.thumbnail} 
                            alt={tfg.title} 
                            fill
                            className="rounded-lg absolute border- w-full h-full object-cover" />
                        </div>
                        
                        <div className="z-10 rounded-lg absolute invisible w-full transition-all group-hover:shadow-xl-d duration-300 opacity-0 delay-0 
                        group-hover:delay-75 group-hover:opacity-100 group-hover:visible bg-popup -mt-5 pt-5">
                            <div className="w-full p-3">
                                <div className="flex">
                                    <h3 className="text-sm font-bold mb-2 flex-1">{tfg.title}</h3>
                                    <div className="flex-none">
                                        <FavButton id={tfg.id} />
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-semibold">
                                    {tfg.createdAt.getFullYear()} 
                                </span>
                                <span className="inline-block scale-85 text-lg">
                                    <Chip color="secondary" variant="solid">{tfg.pages} páginas</Chip>
                                </span>
                                <p className="text-sm line-clamp-2 pt-2">{tfg.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }
        </div>
    );
}