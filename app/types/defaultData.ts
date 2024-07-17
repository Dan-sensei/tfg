import { Role } from "../lib/enums";

export const DAY = 86400;
export const HALF_DAY = 43200;

export const DEF_ICON_SIZE = 18;

export const PAGINATION_SIZE = 30;

export const ROW_SIZE = 30;

export const ROW_RECOMMENDED_MAX_VIEWS = 100000;
export const ROW_RECOMMENDED_SCORE_MULT = 0.4;
export const ROW_RECOMMENDED_VIEWS_MULT = 0.4;
export const ROW_RECOMMENDED_RANDOM_MULT = 100;
export const TAG_RECOMMENDED_POINTS = 1000;
export const MAX_TAGS_IN_COOKIE = 20;

export const INTERESTED_TIMEOUT = 10 * 1000;

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

export const CHATBOX_REFRESH_INTERVAL = 5000;

export const MAX_BANNER_SIZE = 5 * 1024 * 1024;
export const MAX_BANNER_DIMENSIONS = {
    width: 1200,
    height: 630,
};

export const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;
export const MAX_THUMBNAIL_DIMENSIONS = { width: 400, height: 225 };

export const MAX_TITLE_LENGTH = 70;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_BLOCK_TITLE_LENGTH = 30;
export const MAX_BLOCK_DESCRIPTION_LENGTH = 500;

export const DEF_BANNER = "/default/def_banner.jpg";
export const DEF_CROPBOX_SIZE = 350;
export const MAX_IMAGE_BLOCK_HEIGHT = 500;
export const MAX_BLOCK_IMAGE_SIZE = 3 * 1024 * 1024;
export const MAX_BLOCK_IMAGE_DIMENSIONS = { width: 1000, height: MAX_IMAGE_BLOCK_HEIGHT };
export const MIN_IMAGE_BLOCK_HEIGHT = 100;

export const MAX_DEFENSE_TITLE_LENGTH = 50;

export const MAX_SOCIAL_LINK_LENGTH = 70;

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
    tags: [],
};
