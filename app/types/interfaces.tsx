export interface iTFG {
    title: string,
    id: number,
    thumbnail: string,
    description: string,
    views: number,
    score: number,
    pages: number,
    createdAt?: Date,
}

export interface iHomeTFG {
    id: number,
    banner: string,
    description: string,
    title: string,
    views: number,
    score: number,
    createdAt?: Date,
}