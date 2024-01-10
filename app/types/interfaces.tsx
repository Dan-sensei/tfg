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
export interface iFullTFG {
    id: number,
    thumbnail: string,
    banner: string,
    title: string,
    description: string,
    author: string,
    tutor: string,
    content: string,
    pages: number,
    documentLink: string,
    tags: string[],
    views: number,
    score: number,
    createdAt: Date
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

export enum DBProperty {
    GradeMaster = 0,
    Category = 1
}

export type MostPopular = {
    type: number,
    id: number,
    views: number,
};
export interface PopularFields{
	grade: number[],
	category: number[]
    order: MostPopular[]
}
export interface TFGQueryParamsWhere {
    gradeId?: number;
    categoryId?: number;
}

export interface TFGRowData {
    id: number,
    name: string,
    tfgs: iTFG[]
}