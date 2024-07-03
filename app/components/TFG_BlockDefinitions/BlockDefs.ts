import { MAX_BLOCK_DESCRIPTION_LENGTH, MAX_BLOCK_TITLE_LENGTH, MAX_IMAGE_BLOCK_HEIGHT } from "@/app/types/defaultData";
import { DOUBLE_MEDIA, DOUBLE_TEXT, MEDIA_TEXT, SINGLE_MEDIA, SINGLE_TEXT, TEXT_MEDIA, TRIPLE_MEDIA, TRIPLE_TEXT } from "./DisplayComponents";
import { isNullOrEmpty } from "@/app/utils/util";
import * as v from "valibot";

export enum MEDIATXT_SLOTS {
    /* REQUIRED PARAMS */
    MEDIA_MAX_HEIGHT = 0,
    MEDIA_POSITION,
    MEDIA_TYPE,
    MEDIA_SRC,
    IMG_MODAL_CLICK,
    IMG_HAS_TRANSPARENCY,
    TEXT_TITLE,
    TEXT,
    TEXT_ALIGN,
    TEXT_POSITION,
    __LENGTH,
    /* LOCALSTORAGE PARAMS */
    IMG_SRC_LINK,
    VID_SRC_LINK,
}

/* TXTMEDIA_SLOTS SAME AS MEDIATXT_SLOTS FOR NOW*/

export enum SINGLE_MEDIA_SLOTS {
    /* REQUIRED PARAMS */
    MEDIA_MAX_HEIGHT = 0,
    MEDIA_POSITION,
    MEDIA_TYPE,
    MEDIA_SRC,
    IMG_MODAL_CLICK,
    IMG_HAS_TRANSPARENCY,
    __LENGTH,
    /* LOCALSTORAGE PARAMS */
    IMG_SRC_LINK,
    VID_SRC_LINK,
}

export enum DOUBLE_MEDIA_SLOTS {
    /* REQUIRED PARAMS */
    MEDIA_1_MAX_HEIGHT = 0,
    MEDIA_1_POSITION,
    MEDIA_1_TYPE,
    MEDIA_1_SRC,
    IMG_1_MODAL_CLICK,
    IMG_1_HAS_TRANSPARENCY,

    MEDIA_2_MAX_HEIGHT,
    MEDIA_2_POSITION,
    MEDIA_2_TYPE,
    MEDIA_2_SRC,
    IMG_2_MODAL_CLICK,
    IMG_2_HAS_TRANSPARENCY,
    __LENGTH,

    /* LOCALSTORAGE PARAMS */
    IMG_1_SRC_LINK,
    VID_1_SRC_LINK,

    IMG_2_SRC_LINK,
    VID_2_SRC_LINK,
}

export enum TRIPLE_MEDIA_SLOTS {
    /* REQUIRED PARAMS */
    MEDIA_1_MAX_HEIGHT = 0,
    MEDIA_1_POSITION,
    MEDIA_1_TYPE,
    MEDIA_1_SRC,
    IMG_1_MODAL_CLICK,
    IMG_1_HAS_TRANSPARENCY,

    MEDIA_2_MAX_HEIGHT,
    MEDIA_2_POSITION,
    MEDIA_2_TYPE,
    MEDIA_2_SRC,
    IMG_2_MODAL_CLICK,
    IMG_2_HAS_TRANSPARENCY,

    MEDIA_3_MAX_HEIGHT,
    MEDIA_3_POSITION,
    MEDIA_3_TYPE,
    MEDIA_3_SRC,
    IMG_3_MODAL_CLICK,
    IMG_3_HAS_TRANSPARENCY,
    __LENGTH,

    /* LOCALSTORAGE PARAMS */
    IMG_1_SRC_LINK,
    VID_1_SRC_LINK,

    IMG_2_SRC_LINK,
    VID_2_SRC_LINK,

    IMG_3_SRC_LINK,
    VID_3_SRC_LINK,
}

export enum SINGLE_TEXT_SLOTS {
    TEXT_TITLE,
    TEXT,
    TEXT_ALIGN,
    __LENGTH,
}
export enum DOUBLE_TEXT_SLOTS {
    TEXT_1_TITLE,
    TEXT_1,
    TEXT_1_ALIGN,

    TEXT_2_TITLE,
    TEXT_2,
    TEXT_2_ALIGN,
    __LENGTH,
}

export enum TRIPLE_TEXT_SLOTS {
    TEXT_1_TITLE,
    TEXT_1,
    TEXT_1_ALIGN,

    TEXT_2_TITLE,
    TEXT_2,
    TEXT_2_ALIGN,

    TEXT_3_TITLE,
    TEXT_3,
    TEXT_3_ALIGN,
    __LENGTH,
}

export enum BLOCKTYPE {
    MEDIA_TEXT = 1,
    TEXT_MEDIA,
    SINGLE_MEDIA,
    DOUBLE_MEDIA,
    TRIPLE_MEDIA,
    SINGLE_TEXT,
    DOUBLE_TEXT,
    TRIPLE_TEXT,
}

export type ParamErrorMessage = {
    paramId: number;
    errorMessage: string;
};

export type iFile = {
    id: number;
    blob: Blob;
};
export type TFG_BLockElement = {
    type: BLOCKTYPE;
    params: string[];
};
export interface BlockInfo extends TFG_BLockElement {
    id: number;
    files: iFile[];
    errors: string[];
}
export type DetailsProps = {
    blocks: TFG_BLockElement[];
};

type DefBlockValue = {
    [key: string]: string;
};

type SkipUnless = {
    skip: number;
    unless: (source: string[]) => boolean;
};

type _BLOCK_DATA = {
    element: (props: { params: string[] }) => JSX.Element;
    DEF_VALUES: DefBlockValue;
    SKIP_LOCAL_SAVE_UNLESS: SkipUnless[];
    VALIDATE: any;
    expectedParameters: number;
};

interface BLOCK_DATA_TYPE {
    [key: string]: _BLOCK_DATA;
}
export const BLOCKSCHEMA: BLOCK_DATA_TYPE = {
    [BLOCKTYPE.MEDIA_TEXT]: {
        element: MEDIA_TEXT,
        DEF_VALUES: {
            [MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [MEDIATXT_SLOTS.MEDIA_POSITION]: "lg:mx-auto",
            [MEDIATXT_SLOTS.MEDIA_TYPE]: "image",
            [MEDIATXT_SLOTS.MEDIA_SRC]: "",
            [MEDIATXT_SLOTS.IMG_MODAL_CLICK]: "true",
            [MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY]: "false",
            [MEDIATXT_SLOTS.TEXT_TITLE]: "",
            [MEDIATXT_SLOTS.TEXT]: "Contenido",
            [MEDIATXT_SLOTS.TEXT_ALIGN]: "lg:text-left",
            [MEDIATXT_SLOTS.TEXT_POSITION]: "lg:items-start",
            [MEDIATXT_SLOTS.IMG_SRC_LINK]: "",
            [MEDIATXT_SLOTS.VID_SRC_LINK]: "",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: MEDIATXT_SLOTS.MEDIA_SRC,
                unless: (source: string[]) => {
                    return (
                        !isNullOrEmpty(source[MEDIATXT_SLOTS.VID_SRC_LINK]) ||
                        (!isNullOrEmpty(source[MEDIATXT_SLOTS.IMG_SRC_LINK]) && source[MEDIATXT_SLOTS.MEDIA_TYPE] === "image")
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(MEDIATXT_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[MEDIATXT_SLOTS.MEDIA_SRC]), "Adjunta una imagen o vídeo"),
            v.check((params) => !isNullOrEmpty(params[MEDIATXT_SLOTS.TEXT]), "El texto no puede estar vacío"),
            v.check(
                (params) => params[MEDIATXT_SLOTS.TEXT].length < MAX_BLOCK_DESCRIPTION_LENGTH,
                `El texto no ocupar más de ${MAX_BLOCK_DESCRIPTION_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[MEDIATXT_SLOTS.TEXT_TITLE].length < MAX_BLOCK_TITLE_LENGTH,
                `El título no ocupar más de ${MAX_BLOCK_TITLE_LENGTH} carácteres`
            )
        ),
        expectedParameters: MEDIATXT_SLOTS.__LENGTH,
    },
    [BLOCKTYPE.TEXT_MEDIA]: {
        element: TEXT_MEDIA,
        DEF_VALUES: {
            [MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [MEDIATXT_SLOTS.MEDIA_POSITION]: "lg:mx-auto",
            [MEDIATXT_SLOTS.MEDIA_TYPE]: "image",
            [MEDIATXT_SLOTS.MEDIA_SRC]: "",
            [MEDIATXT_SLOTS.IMG_MODAL_CLICK]: "true",
            [MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY]: "false",
            [MEDIATXT_SLOTS.TEXT_TITLE]: "",
            [MEDIATXT_SLOTS.TEXT]: "Contenido",
            [MEDIATXT_SLOTS.TEXT_ALIGN]: "lg:text-right",
            [MEDIATXT_SLOTS.TEXT_POSITION]: "lg:items-start",
            [MEDIATXT_SLOTS.IMG_SRC_LINK]: "",
            [MEDIATXT_SLOTS.VID_SRC_LINK]: "",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: MEDIATXT_SLOTS.MEDIA_SRC,
                unless: (source: string[]) => {
                    return (
                        !isNullOrEmpty(source[MEDIATXT_SLOTS.VID_SRC_LINK]) ||
                        (!isNullOrEmpty(source[MEDIATXT_SLOTS.IMG_SRC_LINK]) && source[MEDIATXT_SLOTS.MEDIA_TYPE] === "image")
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(MEDIATXT_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[MEDIATXT_SLOTS.MEDIA_SRC]), "Adjunta una imagen o vídeo"),
            v.check((params) => !isNullOrEmpty(params[MEDIATXT_SLOTS.TEXT]), "El texto no puede estar vacío"),
            v.check(
                (params) => params[MEDIATXT_SLOTS.TEXT].length < MAX_BLOCK_DESCRIPTION_LENGTH,
                `El texto no ocupar más de ${MAX_BLOCK_DESCRIPTION_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[MEDIATXT_SLOTS.TEXT_TITLE].length < MAX_BLOCK_TITLE_LENGTH,
                `El título no ocupar más de ${MAX_BLOCK_TITLE_LENGTH} carácteres`
            )
        ),
        expectedParameters: MEDIATXT_SLOTS.__LENGTH,
    },
    [BLOCKTYPE.SINGLE_MEDIA]: {
        element: SINGLE_MEDIA,
        DEF_VALUES: {
            [SINGLE_MEDIA_SLOTS.MEDIA_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [SINGLE_MEDIA_SLOTS.MEDIA_POSITION]: "lg:mx-auto",
            [SINGLE_MEDIA_SLOTS.MEDIA_TYPE]: "image",
            [SINGLE_MEDIA_SLOTS.MEDIA_SRC]: "",
            [SINGLE_MEDIA_SLOTS.IMG_MODAL_CLICK]: "true",
            [SINGLE_MEDIA_SLOTS.IMG_HAS_TRANSPARENCY]: "false",
            [SINGLE_MEDIA_SLOTS.IMG_SRC_LINK]: "",
            [SINGLE_MEDIA_SLOTS.VID_SRC_LINK]: "",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: SINGLE_MEDIA_SLOTS.MEDIA_SRC,
                unless: (source: string[]) => {
                    return (
                        !isNullOrEmpty(source[SINGLE_MEDIA_SLOTS.VID_SRC_LINK]) ||
                        (!isNullOrEmpty(source[SINGLE_MEDIA_SLOTS.IMG_SRC_LINK]) && source[SINGLE_MEDIA_SLOTS.MEDIA_TYPE] === "image")
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(SINGLE_MEDIA_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[SINGLE_MEDIA_SLOTS.MEDIA_SRC]), "Adjunta una imagen o vídeo"),
        ),
        expectedParameters: SINGLE_MEDIA_SLOTS.__LENGTH,
    },
    [BLOCKTYPE.DOUBLE_MEDIA]: {
        element: DOUBLE_MEDIA,
        DEF_VALUES: {
            [DOUBLE_MEDIA_SLOTS.MEDIA_1_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [DOUBLE_MEDIA_SLOTS.MEDIA_1_POSITION]: "lg:mx-auto",
            [DOUBLE_MEDIA_SLOTS.MEDIA_1_TYPE]: "image",
            [DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC]: "",
            [DOUBLE_MEDIA_SLOTS.IMG_1_MODAL_CLICK]: "true",
            [DOUBLE_MEDIA_SLOTS.IMG_1_HAS_TRANSPARENCY]: "false",
            [DOUBLE_MEDIA_SLOTS.IMG_1_SRC_LINK]: "",
            [DOUBLE_MEDIA_SLOTS.VID_1_SRC_LINK]: "",

            [DOUBLE_MEDIA_SLOTS.MEDIA_2_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [DOUBLE_MEDIA_SLOTS.MEDIA_2_POSITION]: "lg:mx-auto",
            [DOUBLE_MEDIA_SLOTS.MEDIA_2_TYPE]: "image",
            [DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC]: "",
            [DOUBLE_MEDIA_SLOTS.IMG_2_MODAL_CLICK]: "true",
            [DOUBLE_MEDIA_SLOTS.IMG_2_HAS_TRANSPARENCY]: "false",
            [DOUBLE_MEDIA_SLOTS.IMG_2_SRC_LINK]: "",
            [DOUBLE_MEDIA_SLOTS.VID_2_SRC_LINK]: "",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC,
                unless: (source: string[]) => {
                    return (
                        !isNullOrEmpty(source[DOUBLE_MEDIA_SLOTS.VID_1_SRC_LINK]) ||
                        (!isNullOrEmpty(source[DOUBLE_MEDIA_SLOTS.IMG_1_SRC_LINK]) && source[DOUBLE_MEDIA_SLOTS.MEDIA_1_TYPE] === "image")
                    );
                },
            },
            {
                skip: DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC,
                unless: (source: string[]) => {
                    return (
                        !isNullOrEmpty(source[DOUBLE_MEDIA_SLOTS.VID_2_SRC_LINK]) ||
                        (!isNullOrEmpty(source[DOUBLE_MEDIA_SLOTS.IMG_2_SRC_LINK]) && source[DOUBLE_MEDIA_SLOTS.MEDIA_2_TYPE] === "image")
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(DOUBLE_MEDIA_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC]), "El recurso [1] está vacío"),
            v.check((params) => !isNullOrEmpty(params[DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC]), "El recurso [2] está vacío"),
        ),
        expectedParameters: DOUBLE_MEDIA_SLOTS.__LENGTH,
    },
    [BLOCKTYPE.TRIPLE_MEDIA]: {
        element: TRIPLE_MEDIA,
        DEF_VALUES: {
            [TRIPLE_MEDIA_SLOTS.MEDIA_1_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [TRIPLE_MEDIA_SLOTS.MEDIA_1_POSITION]: "lg:mx-auto",
            [TRIPLE_MEDIA_SLOTS.MEDIA_1_TYPE]: "image",
            [TRIPLE_MEDIA_SLOTS.MEDIA_1_SRC]: "",
            [TRIPLE_MEDIA_SLOTS.IMG_1_MODAL_CLICK]: "true",
            [TRIPLE_MEDIA_SLOTS.IMG_1_HAS_TRANSPARENCY]: "false",
            [TRIPLE_MEDIA_SLOTS.IMG_1_SRC_LINK]: "",
            [TRIPLE_MEDIA_SLOTS.VID_1_SRC_LINK]: "",

            [TRIPLE_MEDIA_SLOTS.MEDIA_2_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [TRIPLE_MEDIA_SLOTS.MEDIA_2_POSITION]: "lg:mx-auto",
            [TRIPLE_MEDIA_SLOTS.MEDIA_2_TYPE]: "image",
            [TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC]: "",
            [TRIPLE_MEDIA_SLOTS.IMG_2_MODAL_CLICK]: "true",
            [TRIPLE_MEDIA_SLOTS.IMG_2_HAS_TRANSPARENCY]: "false",
            [TRIPLE_MEDIA_SLOTS.IMG_2_SRC_LINK]: "",
            [TRIPLE_MEDIA_SLOTS.VID_2_SRC_LINK]: "",

            [TRIPLE_MEDIA_SLOTS.MEDIA_3_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [TRIPLE_MEDIA_SLOTS.MEDIA_3_POSITION]: "lg:mx-auto",
            [TRIPLE_MEDIA_SLOTS.MEDIA_3_TYPE]: "image",
            [TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC]: "",
            [TRIPLE_MEDIA_SLOTS.IMG_3_MODAL_CLICK]: "true",
            [TRIPLE_MEDIA_SLOTS.IMG_3_HAS_TRANSPARENCY]: "false",
            [TRIPLE_MEDIA_SLOTS.IMG_3_SRC_LINK]: "",
            [TRIPLE_MEDIA_SLOTS.VID_3_SRC_LINK]: "",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: TRIPLE_MEDIA_SLOTS.MEDIA_1_SRC,
                unless: (source: string[]) => {
                    return (
                        !isNullOrEmpty(source[TRIPLE_MEDIA_SLOTS.VID_1_SRC_LINK]) ||
                        (!isNullOrEmpty(source[TRIPLE_MEDIA_SLOTS.IMG_1_SRC_LINK]) && source[TRIPLE_MEDIA_SLOTS.MEDIA_1_TYPE] === "image")
                    );
                },
            },
            {
                skip: TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC,
                unless: (source: string[]) => {
                    return (
                        !isNullOrEmpty(source[TRIPLE_MEDIA_SLOTS.VID_2_SRC_LINK]) ||
                        (!isNullOrEmpty(source[TRIPLE_MEDIA_SLOTS.IMG_2_SRC_LINK]) && source[TRIPLE_MEDIA_SLOTS.MEDIA_2_TYPE] === "image")
                    );
                },
            },
            {
                skip: TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC,
                unless: (source: string[]) => {
                    return (
                        !isNullOrEmpty(source[TRIPLE_MEDIA_SLOTS.VID_3_SRC_LINK]) ||
                        (!isNullOrEmpty(source[TRIPLE_MEDIA_SLOTS.IMG_3_SRC_LINK]) && source[TRIPLE_MEDIA_SLOTS.MEDIA_3_TYPE] === "image")
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(TRIPLE_MEDIA_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[TRIPLE_MEDIA_SLOTS.MEDIA_1_SRC]), "El recurso [1] está vacío"),
            v.check((params) => !isNullOrEmpty(params[TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC]), "El recurso [2] está vacío"),
            v.check((params) => !isNullOrEmpty(params[TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC]), "El recurso [3] está vacío"),
        ),
        expectedParameters: TRIPLE_MEDIA_SLOTS.__LENGTH,
    },
    [BLOCKTYPE.SINGLE_TEXT]: {
        element: SINGLE_TEXT,
        DEF_VALUES: {
            [SINGLE_TEXT_SLOTS.TEXT_TITLE]: "",
            [SINGLE_TEXT_SLOTS.TEXT]: "Contenido",
            [SINGLE_TEXT_SLOTS.TEXT_ALIGN]: "lg:text-center",
        },
        SKIP_LOCAL_SAVE_UNLESS: [],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(SINGLE_TEXT_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[SINGLE_TEXT_SLOTS.TEXT]), "El texto no puede estar vacío"),
            v.check(
                (params) => params[SINGLE_TEXT_SLOTS.TEXT].length < MAX_BLOCK_DESCRIPTION_LENGTH,
                `El texto no ocupar más de ${MAX_BLOCK_DESCRIPTION_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[SINGLE_TEXT_SLOTS.TEXT_TITLE].length < MAX_BLOCK_TITLE_LENGTH,
                `El título no ocupar más de ${MAX_BLOCK_TITLE_LENGTH} carácteres`
            )
        ),
        expectedParameters: SINGLE_TEXT_SLOTS.__LENGTH,
    },
    [BLOCKTYPE.DOUBLE_TEXT]: {
        element: DOUBLE_TEXT,
        DEF_VALUES: {
            [DOUBLE_TEXT_SLOTS.TEXT_1_TITLE]: "",
            [DOUBLE_TEXT_SLOTS.TEXT_1]: "Contenido",
            [DOUBLE_TEXT_SLOTS.TEXT_1_ALIGN]: "lg:text-center",

            [DOUBLE_TEXT_SLOTS.TEXT_2_TITLE]: "",
            [DOUBLE_TEXT_SLOTS.TEXT_2]: "Contenido",
            [DOUBLE_TEXT_SLOTS.TEXT_2_ALIGN]: "lg:text-center",
        },
        SKIP_LOCAL_SAVE_UNLESS: [],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(DOUBLE_TEXT_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[DOUBLE_TEXT_SLOTS.TEXT_1]), "El texto no puede estar vacío"),
            v.check(
                (params) => params[DOUBLE_TEXT_SLOTS.TEXT_1].length < MAX_BLOCK_DESCRIPTION_LENGTH,
                `El texto [1] no ocupar más de ${MAX_BLOCK_DESCRIPTION_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[DOUBLE_TEXT_SLOTS.TEXT_1_TITLE].length < MAX_BLOCK_TITLE_LENGTH,
                `El título [1] no ocupar más de ${MAX_BLOCK_TITLE_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[DOUBLE_TEXT_SLOTS.TEXT_2].length < MAX_BLOCK_DESCRIPTION_LENGTH,
                `El texto [2] no ocupar más de ${MAX_BLOCK_DESCRIPTION_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[DOUBLE_TEXT_SLOTS.TEXT_2_TITLE].length < MAX_BLOCK_TITLE_LENGTH,
                `El título [2] no ocupar más de ${MAX_BLOCK_TITLE_LENGTH} carácteres`
            )
        ),
        expectedParameters: DOUBLE_TEXT_SLOTS.__LENGTH,
    },
    [BLOCKTYPE.TRIPLE_TEXT]: {
        element: TRIPLE_TEXT,
        DEF_VALUES: {
            [TRIPLE_TEXT_SLOTS.TEXT_1_TITLE]: "",
            [TRIPLE_TEXT_SLOTS.TEXT_1]: "Contenido",
            [TRIPLE_TEXT_SLOTS.TEXT_1_ALIGN]: "lg:text-center",
            [TRIPLE_TEXT_SLOTS.TEXT_2_TITLE]: "",
            [TRIPLE_TEXT_SLOTS.TEXT_2]: "Contenido",
            [TRIPLE_TEXT_SLOTS.TEXT_2_ALIGN]: "lg:text-center",
            [TRIPLE_TEXT_SLOTS.TEXT_3_TITLE]: "",
            [TRIPLE_TEXT_SLOTS.TEXT_3]: "Contenido",
            [TRIPLE_TEXT_SLOTS.TEXT_3_ALIGN]: "lg:text-center",
        },
        SKIP_LOCAL_SAVE_UNLESS: [],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(TRIPLE_TEXT_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[TRIPLE_TEXT_SLOTS.TEXT_1]), "El texto no puede estar vacío"),
            v.check(
                (params) => params[TRIPLE_TEXT_SLOTS.TEXT_1].length < MAX_BLOCK_DESCRIPTION_LENGTH,
                `El texto [1] no ocupar más de ${MAX_BLOCK_DESCRIPTION_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[TRIPLE_TEXT_SLOTS.TEXT_1_TITLE].length < MAX_BLOCK_TITLE_LENGTH,
                `El título [1] no ocupar más de ${MAX_BLOCK_TITLE_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[TRIPLE_TEXT_SLOTS.TEXT_2].length < MAX_BLOCK_DESCRIPTION_LENGTH,
                `El texto [2] no ocupar más de ${MAX_BLOCK_DESCRIPTION_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[TRIPLE_TEXT_SLOTS.TEXT_2_TITLE].length < MAX_BLOCK_TITLE_LENGTH,
                `El título [2] no ocupar más de ${MAX_BLOCK_TITLE_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[TRIPLE_TEXT_SLOTS.TEXT_3].length < MAX_BLOCK_DESCRIPTION_LENGTH,
                `El texto [3] no ocupar más de ${MAX_BLOCK_DESCRIPTION_LENGTH} carácteres`
            ),
            v.check(
                (params) => params[TRIPLE_TEXT_SLOTS.TEXT_3_TITLE].length < MAX_BLOCK_TITLE_LENGTH,
                `El título [3] no ocupar más de ${MAX_BLOCK_TITLE_LENGTH} carácteres`
            )
        ),
        expectedParameters: TRIPLE_TEXT_SLOTS.__LENGTH,
    },
};

export type savedImageInfoType = {
    banner: boolean;
    thumbnail: boolean;
    content: number[];
};
