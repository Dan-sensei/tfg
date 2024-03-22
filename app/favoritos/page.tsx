'use client';
import { useFavorites } from "@/app/FavoritesContext";
import  Favorites  from '../components/Favorites';
import { useEffect, useState } from "react";
import {Chip} from "@nextui-org/chip";
import FavButton from "@/app/components/FavButton";
import Image from "next/image"
import Card from "@/app/components/Card";
import { iTFG } from "@/app/types/interfaces";
import { getFavorites } from "../lib/actions/favorites";

export default function Favoritos() {
    const [isMounted, setIsMounted] = useState(false);
    const [favorites, setFavorites] = useState<iTFG[]>([]);
    const { getAllLikes, isInitialized } = useFavorites();

    useEffect(() => {
        if(!isInitialized) return;
        const favoritesIds = getAllLikes();
        if(favoritesIds.length === 0) {
            setIsMounted(true);
            return;
        }
        getFavorites(favoritesIds).then((response) => {
            const result = JSON.parse(response);
            setFavorites(result);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .finally(() => {
            setIsMounted(true);
        });

    }, [isInitialized]);
    
    const removeFromPage = (id: number) => {
        favorites.splice(favorites.findIndex((fav) => fav.id === id), 1);
        setFavorites([...favorites]);
    };

    if(!isMounted) {
        return (
            <div>Loading...</div>
        )
    }
    if(favorites.length === 0) {
        return (
            <div>You have no favorites</div>
        )
    }
    return (
        <div className="h-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-5 gap-5">
                {
                favorites.map((tfg) => (
                    <Card key={tfg.id}
                    id={tfg.id} 
                    thumbnail={tfg.thumbnail} 
                    title={tfg.title} 
                    views={tfg.views}
                    score={tfg.score}
                    description={tfg.description} 
                    pages={tfg.pages} 
                    updateCallback={() => removeFromPage(tfg.id)} />
                ))
                }
            </div>
        </div>
    );
}