'use client';
import { IconHeart } from "@tabler/icons-react";
import { useFavorites } from "@/app/FavoritesContext";

interface FavButtonProps {
    id: number
}

export default function FavButton({id}: FavButtonProps) {
    const favorites = useFavorites().favorites;
    const {add_remove} = useFavorites();
    const enabled = favorites.has(id);
    return (
        <>
            <IconHeart onClick={() => add_remove(id)} className={`cursor-pointer ustify-self-end ml-3 mr-1 text-red-700 stroke-2 ${enabled ? "fill-red-700" : ""} hover:drop-shadow-fav`} />
        </>
    )
}