import { BlockInfo } from "../components/TFG_BlockDefinitions/BlockDefs";
import { Role } from "../lib/enums";

export interface iTFG {
    title: string;
    id: number;
    thumbnail: string;
    description: string;
    views: number;
    score: number;
    pages: number;
    createdAt?: Date;
}
export interface iFullTFG {
    id: number;
    thumbnail: string;
    banner: string;
    title: string;
    description: string;
    author: User[];
    tutor: User[];
    department: Department | null;
    contentBlocks: string;
    pages: number;
    documentLink: string;
    tags: string[];
    views: number;
    score: number;
    createdAt: Date;
    college: College;
}
export type ProjectFormData = {
    id: number;
    thumbnail: string;
    banner: string;
    title: string;
    description: string;
    tutor: FullUser[];
    department: FullDepartment | null;
    category: Category | null;
    titulation: Titulation | null;
    pages: number;
    contentBlocks: BlockInfo[];
    documentLink: string;
    tags: string[];
};
export interface College {
    name: string;
    image: string | null;
}

export interface FullCollege extends College {
    id: number;
}

export interface Department {
    name: string;
    link: string | null;
}
export interface FullDepartment extends Department {
    id: number;
}

export interface User {
    name: string;
    contactDetails: string | null;
    image: string | null;
}

export interface FullUser extends User {
    id: number;
}

export interface iHomeTFG {
    id: number;
    banner: string;
    description: string;
    title: string;
    views: number;
    score: number;
    createdAt?: Date;
}

export type CategoryLink = {
    id: string;
    name: string;
};

export enum DBProperty {
    Titulation = 0,
    Category = 1,
}

export type MostPopular = {
    type: number;
    id: number;
    views: number;
};
export interface PopularFields {
    grade: number[];
    category: number[];
    order: MostPopular[];
}
export interface TFGQueryParamsWhere {
    gradeId?: number;
    categoryId?: number;
}

export interface TFGRowData {
    id: number;
    type: string;
    name: string;
    tfgs: iTFG[];
}

export type TFGPagination = {
    tfgs: iTFG[];
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    title: string;
};
export type Category = {
    id: number;
    name: string;
};
export type Titulation = {
    id: number;
    name: string;
};
export type RedisCategoryData = {
    name: string;
    totalElements: number;
};

export type RedisSet = {
    member: string;
    score: number;
};
export type PopularTag = {
    tag: string;
    count: number;
};

export type QueryParams = {
    q?: string;
    tags?: string;
    category?: string;
    titulation?: string;
    fromdate?: string;
    todate?: string;
    minpages?: string;
    maxpages?: string;
    minviews?: string;
    maxviews?: string;
    minscore?: string;
    maxscore?: string;
    sortby?: string;
    sortorder?: string;
    page?: string;
};

export interface LinkProps {
    name: string;
    href: string;
    isCategories?: boolean;
}
export interface MobileLinkProps extends LinkProps {
    icon?: JSX.Element;
    isSubcategory?: boolean;
}

export type MessageError = {
    thumbnail: string;
    banner: string;
    title: string;
    description: string;
    contentBlocks: string;
    documentLink: string;
    pages: string;
    tags: string;
    tutor: string;
};



export type dimension = {
    width: number;
    height: number;
};
