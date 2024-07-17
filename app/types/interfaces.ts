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
export interface iDetailsTFG {
    id: number;
    thumbnail: string;
    banner: string;
    title: string;
    description: string;
    author: User[];
    tutors: User[];
    department: FullDepartment | null;
    contentBlocks: string;
    pages: number;
    documentLink: string;
    tags: string[];
    views: number;
    score: number;
    createdAt: Date;
    college: College;
}
export interface ProjectFormData {
    id: number;
    thumbnail: string;
    banner: string;
    title: string;
    description: string;
    tutors: FullUser[];
    department: FullDepartment | null;
    category: Category;
    titulation: Titulation;
    pages: number;
    contentBlocks: BlockInfo[];
    documentLink: string;
    tags: string[];
}

export interface ProjectFromDataSend {
    title: string;
    banner: string | null;
    description: string;
    documentLink: string;
    pages: number;
    titulationId: number;
    categoryId: number;
    departmentId: number | null;
    thumbnail: string | null;
    tags: string[];
    contentBlocks: BlockInfo[];
    tutors: number[];
    collegeId: number;
}
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

export interface DepartmentWithTFGCount extends FullDepartment {
    totalProjects: number;
}

export interface SimplifiedUser {
    id: number;
    name: string;
    image: string | null;
}

export interface User {
    name: string;
    socials?: string | null;
    personalPage?: string | null;
    image: string | null;
    showImage?: boolean;
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
    name: string;
    link: string;
    tfgs: iTFG[];
}

export type TFGPagination = {
    tfgs: iTFG[];
    pageSize: number;
    totalPages: number;
};
export type Category = {
    id: number;
    name: string;
};
export interface CategoryWithTFGCount extends Category {
    totalProjects: number;
}
export type Titulation = {
    id: number;
    name: string;
};

export interface TitulationWithTFGCount extends Titulation {
    totalProjects: number;
}
export interface TitulationByCollege {
    collegeId: number;
    collegeName: string;
    titulations: Titulation[];
}

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
    orderby?: string;
    orderdirection?: string;
    currentpage?: string;
};

export interface LinkProps {
    name: string;
    href: string;
    isCategories?: boolean;
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
    tutors: string;
};

export type dimension = {
    width: number;
    height: number;
};

export interface ReviewMessageType {
    readonly id: number;
    readonly message: string;
    readonly user: SimplifiedUser | null;
    readonly createdAt: Date;
    readonly edited: boolean;
    readonly readBy: number[];
}

export interface iPublishCheck {
    id: number;
    thumbnail: string;
    banner: string;
    title: string;
    contentBlocks: string;
    pages: number;
    documentLink: string;
    tags: string[];
    description: string;
    categoryId: number;
    departmentId: number | null;
    titulationId: number;
}

export interface iDashboardProject {
    id: number;
    thumbnail: string;
    title: string;
    views: number;
    score: number;
    createdAt: Date;
    description: string;
    status: number;
    authors: {
        name: string;
    }[];
}

export interface Location {
    id: number;
    name: string;
    mapLink: string | null;
}
export interface LocationWithDefenseCount extends Location {
    totalDefenses: number;
}

export interface DefenseData {
    id: number;
    collegeId: number;
    title: string;
    startTime: Date;
    endTime: Date;
    location: Location;
}