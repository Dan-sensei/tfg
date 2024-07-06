import {
    MAX_BANNER_SIZE,
    MAX_BLOCK_DESCRIPTION_LENGTH,
    MAX_BLOCK_TITLE_LENGTH,
    MAX_DESCRIPTION_LENGTH,
    MAX_IMAGE_BLOCK_HEIGHT,
    MAX_LINK_LENGTH,
    MAX_THUMBNAIL_SIZE,
    MAX_TITLE_LENGTH,
} from "@/app/types/defaultData";
import { DOUBLE_MEDIA, DOUBLE_TEXT, MEDIA_TEXT, SINGLE_MEDIA, SINGLE_TEXT, TEXT_MEDIA, TRIPLE_MEDIA, TRIPLE_TEXT } from "./DisplayComponents";
import { isNullOrEmpty, roundTwoDecimals } from "@/app/utils/util";
import * as v from "valibot";

export enum MEDIATXT_SLOTS {
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
}

/* TXTMEDIA_SLOTS SAME AS MEDIATXT_SLOTS FOR NOW*/

export enum SINGLE_MEDIA_SLOTS {
    MEDIA_MAX_HEIGHT = 0,
    MEDIA_POSITION,
    MEDIA_TYPE,
    MEDIA_SRC,
    IMG_MODAL_CLICK,
    IMG_HAS_TRANSPARENCY,
    __LENGTH,
}

export enum DOUBLE_MEDIA_SLOTS {
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

export const FormSchema = v.object({
    title: v.pipe(
        v.string(),
        v.nonEmpty("Por favor introduce un título"),
        v.maxLength(MAX_TITLE_LENGTH, `El título no puede ocupar más de ${MAX_TITLE_LENGTH} carácteres`)
    ),
    banner: v.union(
        [
            v.pipe(
                v.blob("Por favor adjunta una imagen para el banner"),
                v.mimeType(["image/jpeg", "image/jpg", "image/png"], "Sólo archivos JPEG, JPG o PNG"),
                v.maxSize(MAX_BANNER_SIZE, `El banner no puede ocupar más de ${roundTwoDecimals(MAX_BANNER_SIZE)}Mb`)
            ),
            v.pipe(v.string(), v.nonEmpty("Por favor adjunta una imagen para el banner")),
        ],
        "Por favor adjunta una imagen para el banner"
    ),
    pages: v.pipe(v.number("El número de páginas debe ser un número"), v.notValue(0, "Por favor introduce un valor mayor a 0")),
    thumbnail: v.union(
        [
            v.pipe(
                v.blob("Por favor adjunta una imagen para la miniatura"),
                v.mimeType(["image/jpeg", "image/jpg", "image/png"], "Sólo archivos JPEG, JPG o PNG"),
                v.maxSize(MAX_THUMBNAIL_SIZE, `El banner no puede ocupar más de ${roundTwoDecimals(MAX_THUMBNAIL_SIZE)}Mb`)
            ),
            v.pipe(v.string(), v.nonEmpty("Por favor adjunta una imagen para la miniatura")),
        ],
        "Por favor adjunta una imagen para la miniatura"
    ),
    description: v.pipe(
        v.string("El título debe ser texto"),
        v.nonEmpty("Por favor introduce una descripción"),
        v.maxLength(MAX_DESCRIPTION_LENGTH, `El título no puede ocupar más de ${MAX_DESCRIPTION_LENGTH} carácteres`)
    ),
    documentLink: v.pipe(
        v.string(),
        v.nonEmpty("Por favor introduce el enlace a tu memoria"),
        v.maxLength(MAX_LINK_LENGTH, `El enlace no puede tener más de ${MAX_LINK_LENGTH} carácteres`)
    ),
    departmentId: v.fallback(v.pipe(v.number(), v.notValue(0)), 1),
    collegeId: v.fallback(v.pipe(v.number(), v.notValue(0)), 1),
    categoryId: v.fallback(v.pipe(v.number(), v.notValue(0)), 1),
    titulationId: v.fallback(v.pipe(v.number(), v.notValue(0)), 1),
    tutors: v.pipe(v.array(v.number()), v.minLength(1, "Por favor selecciona al menos un tutor")),
    tags: v.pipe(v.array(v.string()), v.minLength(1, "Por favor selecciona al menos una tag")),
});

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
            [MEDIATXT_SLOTS.IMG_MODAL_CLICK]: "false",
            [MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY]: "false",
            [MEDIATXT_SLOTS.TEXT_TITLE]: "",
            [MEDIATXT_SLOTS.TEXT]: "Contenido",
            [MEDIATXT_SLOTS.TEXT_ALIGN]: "lg:text-left",
            [MEDIATXT_SLOTS.TEXT_POSITION]: "lg:items-start",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: MEDIATXT_SLOTS.MEDIA_SRC,
                unless: (source: string[]) => {
                    return (
                        source[MEDIATXT_SLOTS.MEDIA_TYPE] === "video" ||
                        (source[MEDIATXT_SLOTS.MEDIA_TYPE] === "image" && !source[MEDIATXT_SLOTS.MEDIA_SRC].startsWith("data:image"))
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(MEDIATXT_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[MEDIATXT_SLOTS.MEDIA_SRC]), "Adjunta una imagen o vídeo"),
            v.check(
                (params) => params[MEDIATXT_SLOTS.MEDIA_SRC].length < MAX_LINK_LENGTH,
                `El link del recurso no puede ocupar más de ${MAX_LINK_LENGTH} carácteres.`
            ),
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
            [MEDIATXT_SLOTS.IMG_MODAL_CLICK]: "false",
            [MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY]: "false",
            [MEDIATXT_SLOTS.TEXT_TITLE]: "",
            [MEDIATXT_SLOTS.TEXT]: "Contenido",
            [MEDIATXT_SLOTS.TEXT_ALIGN]: "lg:text-right",
            [MEDIATXT_SLOTS.TEXT_POSITION]: "lg:items-start",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: MEDIATXT_SLOTS.MEDIA_SRC,
                unless: (source: string[]) => {
                    return (
                        source[MEDIATXT_SLOTS.MEDIA_TYPE] === "video" ||
                        (source[MEDIATXT_SLOTS.MEDIA_TYPE] === "image" && !source[MEDIATXT_SLOTS.MEDIA_SRC].startsWith("data:image"))
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(MEDIATXT_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[MEDIATXT_SLOTS.MEDIA_SRC]), "Adjunta una imagen o vídeo"),
            v.check(
                (params) => params[MEDIATXT_SLOTS.MEDIA_SRC].length < MAX_LINK_LENGTH,
                `El link del recurso no puede ocupar más de ${MAX_LINK_LENGTH} carácteres.`
            ),
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
            [SINGLE_MEDIA_SLOTS.IMG_MODAL_CLICK]: "false",
            [SINGLE_MEDIA_SLOTS.IMG_HAS_TRANSPARENCY]: "false",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: SINGLE_MEDIA_SLOTS.MEDIA_SRC,
                unless: (source: string[]) => {
                    return (
                        source[SINGLE_MEDIA_SLOTS.MEDIA_TYPE] === "video" ||
                        (source[SINGLE_MEDIA_SLOTS.MEDIA_TYPE] === "image" && !source[SINGLE_MEDIA_SLOTS.MEDIA_SRC].startsWith("data:image"))
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(SINGLE_MEDIA_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[SINGLE_MEDIA_SLOTS.MEDIA_SRC]), "Adjunta una imagen o vídeo"),
            v.check(
                (params) => params[SINGLE_MEDIA_SLOTS.MEDIA_SRC].length < MAX_LINK_LENGTH,
                `El link del recurso no puede ocupar más de ${MAX_LINK_LENGTH} carácteres.`
            ),
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
            [DOUBLE_MEDIA_SLOTS.IMG_1_MODAL_CLICK]: "false",
            [DOUBLE_MEDIA_SLOTS.IMG_1_HAS_TRANSPARENCY]: "false",

            [DOUBLE_MEDIA_SLOTS.MEDIA_2_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [DOUBLE_MEDIA_SLOTS.MEDIA_2_POSITION]: "lg:mx-auto",
            [DOUBLE_MEDIA_SLOTS.MEDIA_2_TYPE]: "image",
            [DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC]: "",
            [DOUBLE_MEDIA_SLOTS.IMG_2_MODAL_CLICK]: "false",
            [DOUBLE_MEDIA_SLOTS.IMG_2_HAS_TRANSPARENCY]: "false",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC,
                unless: (source: string[]) => {
                    return (
                        source[DOUBLE_MEDIA_SLOTS.MEDIA_1_TYPE] === "video" ||
                        (source[DOUBLE_MEDIA_SLOTS.MEDIA_1_TYPE] === "image" && !source[DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC].startsWith("data:image"))
                    );
                },
            },
            {
                skip: DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC,
                unless: (source: string[]) => {
                    return (
                        source[DOUBLE_MEDIA_SLOTS.MEDIA_2_TYPE] === "video" ||
                        (source[DOUBLE_MEDIA_SLOTS.MEDIA_2_TYPE] === "image" && !source[DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC].startsWith("data:image"))
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(DOUBLE_MEDIA_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC]), "El recurso [1] está vacío"),
            v.check(
                (params) => params[DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC].length < MAX_LINK_LENGTH,
                `El link del recurso [1] no puede ocupar más de ${MAX_LINK_LENGTH} carácteres.`
            ),
            v.check((params) => !isNullOrEmpty(params[DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC]), "El recurso [2] está vacío"),
            v.check(
                (params) => params[DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC].length < MAX_LINK_LENGTH,
                `El link del recurso [2] no puede ocupar más de ${MAX_LINK_LENGTH} carácteres.`
            ),
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
            [TRIPLE_MEDIA_SLOTS.IMG_1_MODAL_CLICK]: "false",
            [TRIPLE_MEDIA_SLOTS.IMG_1_HAS_TRANSPARENCY]: "false",

            [TRIPLE_MEDIA_SLOTS.MEDIA_2_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [TRIPLE_MEDIA_SLOTS.MEDIA_2_POSITION]: "lg:mx-auto",
            [TRIPLE_MEDIA_SLOTS.MEDIA_2_TYPE]: "image",
            [TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC]: "",
            [TRIPLE_MEDIA_SLOTS.IMG_2_MODAL_CLICK]: "false",
            [TRIPLE_MEDIA_SLOTS.IMG_2_HAS_TRANSPARENCY]: "false",

            [TRIPLE_MEDIA_SLOTS.MEDIA_3_MAX_HEIGHT]: MAX_IMAGE_BLOCK_HEIGHT.toString(),
            [TRIPLE_MEDIA_SLOTS.MEDIA_3_POSITION]: "lg:mx-auto",
            [TRIPLE_MEDIA_SLOTS.MEDIA_3_TYPE]: "image",
            [TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC]: "",
            [TRIPLE_MEDIA_SLOTS.IMG_3_MODAL_CLICK]: "false",
            [TRIPLE_MEDIA_SLOTS.IMG_3_HAS_TRANSPARENCY]: "false",
        },
        SKIP_LOCAL_SAVE_UNLESS: [
            {
                skip: TRIPLE_MEDIA_SLOTS.MEDIA_1_SRC,
                unless: (source: string[]) => {
                    return (
                        source[TRIPLE_MEDIA_SLOTS.MEDIA_1_TYPE] === "video" ||
                        (source[TRIPLE_MEDIA_SLOTS.MEDIA_1_TYPE] === "image" && !source[TRIPLE_MEDIA_SLOTS.MEDIA_1_SRC].startsWith("data:image"))
                    );
                },
            },
            {
                skip: TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC,
                unless: (source: string[]) => {
                    return (
                        source[TRIPLE_MEDIA_SLOTS.MEDIA_2_TYPE] === "video" ||
                        (source[TRIPLE_MEDIA_SLOTS.MEDIA_2_TYPE] === "image" && !source[TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC].startsWith("data:image"))
                    );
                },
            },
            {
                skip: TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC,
                unless: (source: string[]) => {
                    return (
                        source[TRIPLE_MEDIA_SLOTS.MEDIA_3_TYPE] === "video" ||
                        (source[TRIPLE_MEDIA_SLOTS.MEDIA_3_TYPE] === "image" && !source[TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC].startsWith("data:image"))
                    );
                },
            },
        ],
        VALIDATE: v.pipe(
            v.array(v.string()),
            v.length(TRIPLE_MEDIA_SLOTS.__LENGTH),
            v.check((params) => !isNullOrEmpty(params[TRIPLE_MEDIA_SLOTS.MEDIA_1_SRC]), "El recurso [1] está vacío"),
            v.check(
                (params) => params[TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC].length < MAX_LINK_LENGTH,
                `El link del recurso [1] no puede ocupar más de ${MAX_LINK_LENGTH} carácteres.`
            ),
            v.check((params) => !isNullOrEmpty(params[TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC]), "El recurso [2] está vacío"),
            v.check(
                (params) => params[TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC].length < MAX_LINK_LENGTH,
                `El link del recurso [2] no puede ocupar más de ${MAX_LINK_LENGTH} carácteres.`
            ),
            v.check((params) => !isNullOrEmpty(params[TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC]), "El recurso [3] está vacío"),
            v.check(
                (params) => params[TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC].length < MAX_LINK_LENGTH,
                `El link del recurso [3] no puede ocupar más de ${MAX_LINK_LENGTH} carácteres.`
            ),
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
