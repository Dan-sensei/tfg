"use client";
import { IconHeart } from "@tabler/icons-react";
import { useFavorites } from "@/app/contexts/FavoritesContext";
import { useEffect, useState } from "react";
import React from "react";

interface FavButtonProps {
    id: number;
}

function FavButton({ id }: FavButtonProps) {
    const [favorite, setFavorite] = useState(false);
    const { isFavorite, toggleFav, isInitialized } = useFavorites();

    useEffect(() => {
        if (isInitialized && isFavorite(id)) {
            setFavorite(true);
        }
    }, [isInitialized, isFavorite, id]);

    const toggleFavorite = () => {
        const fav = !favorite;
        setFavorite(fav);
        toggleFav(id, fav);
    };
    return (
        <>
            <IconHeart
                onClick={toggleFavorite}
                className={`cursor-pointer ustify-self-end ml-3 mr-1 text-red-700 stroke-2 ${favorite ? "fill-red-700" : ""} hover:drop-shadow-fav`}
            />
        </>
    );
}

export default React.memo(FavButton);
