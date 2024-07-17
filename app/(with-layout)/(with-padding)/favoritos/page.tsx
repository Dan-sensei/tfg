"use client";
import { useFavorites } from "@/app/contexts/FavoritesContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { iTFG } from "@/app/types/interfaces";
import { getFavorites } from "../../../lib/actions/favorites";
import { Spinner } from "@nextui-org/spinner";
import { IconCactus, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { sanitizeString } from "../../../utils/util";

export default function Favoritos() {
    const [isMounted, setIsMounted] = useState(false);
    const [favorites, setFavorites] = useState<iTFG[]>([]);
    const { getAllLikes, isInitialized, toggleFav } = useFavorites();
    
    useEffect(() => {
        if (!isInitialized) return;
        const favoritesIds = getAllLikes();
        if (favoritesIds.length === 0) {
            setIsMounted(true);
            return;
        }
        getFavorites(favoritesIds)
            .then((response) => {
                const result = JSON.parse(response);
                setFavorites(result);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                setIsMounted(true);
            });
    }, [isInitialized, getAllLikes]);

    const removeFromFavorites = (id: number) => {
        favorites.splice(
            favorites.findIndex((fav) => fav.id === id),
            1
        );
        setFavorites([...favorites]);
        toggleFav(id, false);
    };

    let content = <></>;
    if (!isMounted) {
        content = (
            <div className="h-full flex items-center justify-center">
                <Spinner
                    classNames={{
                        circle1: "w-16 h-16 border-5",
                        circle2: "w-16 h-16 border-4",
                    }}
                    color="primary"
                ></Spinner>
            </div>
        );
    } else if (favorites.length === 0) {
        content = (
            <div className="h-full flex items-center justify-center">
                <div className="text-center  py-10 ">
                    <IconCactus size={128} className="mx-auto stroke-1" />
                    <div className="w-full text-3xl">Nada que ver</div>
                    <div className="pt-2">
                        Parece que no has añadido ningún trabajo a favoritos
                    </div>
                </div>
            </div>
        );
    } else {
        content = (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 p-5 lg:p-10">
                {favorites.map((tfg, index) => (
                    <div key={index} className="z-0 relative shadow-lg w-full">
                        <Link
                            href={`/page/${tfg.id}/${sanitizeString(
                                tfg.title
                            )}`}
                            className="group grid grid-stack transition-all hover:brightness-150 h-24 lg:h-28 items-center rounded-2xl relative overflow-hidden border-r-3 border-r-blue-500"
                        >
                            <div className="h-full w-full bg-gradient-to-l from-nova-darker-2 via-nova-dark  z-10 relative"></div>
                            <div className="z-0 h-full w-[66%] absolute">
                                <Image
                                    src={tfg.thumbnail}
                                    fill
                                    className="z-0 relative object-cover"
                                    alt={tfg.title}
                                ></Image>
                            </div>
                            <div className="transition-all group-hover:scale-x-105 origin-right z-10 px-5 line-clamp-2 text-end text-sm md:text-medium w-full drop-shadow-dark ml-auto sm:w-[66%] uppercase font-semibold">
                                {tfg.title}
                            </div>
                        </Link>
                        <button
                            className="absolute z-10 top-1 right-2 rounded-full hover:bg-slate-100/20 p-1 transition-colors"
                            onClick={() => removeFromFavorites(tfg.id)}
                        >
                            <IconX size={15}></IconX>
                        </button>
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="h-full py-5 lg:pt-0 w-full">
            <div className="h-full rounded-2xl bg-black/50">{content}</div>
        </div>
    );
}