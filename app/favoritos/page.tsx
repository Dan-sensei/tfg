'use client';
import { useFavorites } from "@/app/FavoritesContext";
import  Favorites  from '../components/Favorites';
import { useEffect, useState } from "react";
import {Chip} from "@nextui-org/chip";
import FavButton from "@/app/components/FavButton";
import Image from "next/image"
import Card from "@/app/components/Card";
import { iTFG } from "@/app/types/interfaces";

export default function Favoritos() {
    const [favorites, setFavorites] = useState<iTFG[]>([]);
    
    useEffect(() => {
        const favoritesIds = localStorage.getItem('favorites') ? Array.from(JSON.parse(localStorage.getItem('favorites')!)) : [];
        if(favoritesIds.length === 0) {
            return;
        }
        fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: favoritesIds }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();   
        })
        .then((result) => {
            setFavorites(result);
        })
        .catch((error) => {
            console.error('Error:', error);
        })

    }, []);
    
    const removeFromPage = (id: number) => {
        favorites.splice(favorites.findIndex((fav) => fav.id === id), 1);
        setFavorites([...favorites]);
    };

    if(favorites.length === 0) {
        return (
            <div>You have no favorites</div>
        )
    }
    return (
        <div className="w-full pt-16 px-20">
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