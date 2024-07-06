import { Role } from "../lib/enums";

export const DAY = 86400;

export const DEF_ICON_SIZE = 18;

export const ROLE_NAMES = {
    [Role.STUDENT]: "Estudiante",
    [Role.TUTOR]: "Tutor",
    [Role.MANAGER]: "Manager",
    [Role.ADMIN]: "Admin",
};

// Dashboard
export const MAX_LINK_LENGTH = 350;
export const MAX_TUTORS = 5;
export const MAX_TAGS = 30;

export const MAX_BANNER_SIZE = 5 * 1024 * 1024;
export const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;
export const MAX_BLOCK_IMAGE_SIZE = 3 * 1024 * 1024;
export const MAX_TITLE_LENGTH = 70;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_BLOCK_TITLE_LENGTH = 30;
export const MAX_BLOCK_DESCRIPTION_LENGTH = 500;

export const DEF_BANNER = "/default/def_banner.jpg";
export const DEF_CROPBOX_SIZE = 350;
export const MAX_IMAGE_BLOCK_WIDTH = 1000;
export const MAX_IMAGE_BLOCK_HEIGHT = 500;

export const partialDefaultProjectData = {
    id: -1,
    thumbnail: "",
    banner: DEF_BANNER,
    title: "",
    description: "",
    contentBlocks: [],
    tutors: [],
    department: null,
    pages: 0,
    documentLink: "",
    tags: []
};