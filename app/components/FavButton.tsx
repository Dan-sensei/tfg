'use client';
import { IconHeart } from "@tabler/icons-react";
import { useFavorites } from "@/app/FavoritesContext";
import { useEffect, useState } from "react";
import React from "react";

interface FavButtonProps {
    id: number,
    updateCallback?: () => void,
}

function FavButton({id, updateCallback}: FavButtonProps) {
    const { isFavorite, toggleFav } = useFavorites();
    const [favorite, setFavorite] = useState<Boolean>(false);

    useEffect(() => {
        if(isFavorite(id)) {
            setFavorite(true);
        }
    }, []);

    const toggleFavorite = () => {
        const fav = !favorite;
        setFavorite(fav);
        toggleFav(id, fav);
        updateCallback?.();
    }
    return (
        <>
            <IconHeart onClick={toggleFavorite} className={`cursor-pointer ustify-self-end ml-3 mr-1 text-red-700 stroke-2 ${favorite ? "fill-red-700" : ""} hover:drop-shadow-fav`} />
        </>
    )
}

export default React.memo(FavButton);