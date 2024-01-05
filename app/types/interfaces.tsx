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

export const DBProperty = {
    GradeMaster: 0,
    Category: 1
}

export type MostPoular = {
    type: number,
    id: number,
    views: number,
};

export interface TFGQueryParamsWhere {
    gradeId?: number;
    categoryId?: number;
}

export interface TFGRowData {
    name: string,
    tfgs: iTFG[]
}