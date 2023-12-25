import prisma from "@/app/utils/db";

interface FavoritesProps {
    ids: number[]
}

async function getFavorites(ids: number[]) {
    
    const favorites = await prisma.tFG.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: {
            id: true,
            thumbnail: true,
            title: true,
            description: true,
            views: true,
            score: true,
            pages: true,
            createdAt: true,
        }
    })
    return favorites;
}

export default async function Favorites({ids}: FavoritesProps) {
    const favorites = await getFavorites(ids);
    return (
        favorites.map((tfg) => (
            <div key={tfg.id}>{tfg.title}</div>
        ))
    )
}