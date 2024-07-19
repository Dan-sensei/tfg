import {
    MAX_BANNER_SIZE,
    MAX_BLOCK_DESCRIPTION_LENGTH,
    MAX_BLOCK_TITLE_LENGTH,
    MAX_DESCRIPTION_LENGTH,
    MAX_IMAGE_BLOCK_HEIGHT,
    MAX_LINK_LENGTH,
    MAX_THUMBNAIL_SIZE,
    MAX_TITLE_LENGTH,
    MIN_IMAGE_BLOCK_HEIGHT,
} from "@/app/types/defaultData";
import {
    BlockParams,
    DOUBLE_MEDIA_ELEMENT,
    DOUBLE_TEXT_ELEMENT,
    MEDIA_TEXT_ELEMENT,
    SINGLE_MEDIA_ELEMENT,
    SINGLE_TEXT_ELEMENT,
    TEXT_MEDIA_ELEMENT,
    TRIPLE_MEDIA_ELEMENT,
    TRIPLE_TEXT_ELEMENT,
} from "./DisplayComponents";
import { roundTwoDecimals } from "@/app/utils/util";
import * as v from "valibot";

export const localStorageBlob = "__data:";

const MEDIA_POSITIONS = ["lg:mr-auto", "lg:mx-auto", "lg:ml-auto"];
const TEXT_ALIGNS = ["lg:text-left", "lg:text-center", "lg:text-right"];
const TEXT_V_ALIGNS = ["lg:items-start", "lg:items-center", "lg:items-end"];
const MEDIA_TYPES = ["image", "video"];

const errorMessages = {
    title: {
        tooLong: (max: number, index?: number) => `El título ${index ? `[${index}]` : ""} no ocupar más de ${max} carácteres`,
    },
    content: {
        empty: (index?: number) => `El cuerpo de texto ${index ? `[${index}]` : ""} no puede estar vacío`,
        tooLong: (max: number, index?: number) => `El cuerpo de texto ${index ? `[${index}]` : ""} no puede ocupar más de ${max} carácteres`,
    },
    media_src: {
        empty: (index?: number) => `Recurso ${index ? `[${index}]` : ""} vacío`,
        tooLong: (max: number, index?: number) => `El link del recurso ${index ? `[${index}]` : ""} no puede ocupar más de ${max} carácteres`,
    },
};

// MEDIA SCHEMAS
const mediaSrcSchema = (index?: number) =>
    v.pipe(
        v.string(),
        v.nonEmpty(errorMessages.media_src.empty(index)),
        v.check((input) => input.startsWith("data:") || input.length <= MAX_LINK_LENGTH, errorMessages.media_src.tooLong(MAX_LINK_LENGTH)),
        v.transform((input) => (input.startsWith("data:") ? "data:" : input))
    );
const maxHeightSchema = v.fallback(
    v.pipe(v.number(), v.minValue(MIN_IMAGE_BLOCK_HEIGHT), v.maxValue(MAX_IMAGE_BLOCK_HEIGHT)),
    MAX_IMAGE_BLOCK_HEIGHT
);
const mediaPositionSchema = v.fallback(v.picklist(MEDIA_POSITIONS), MEDIA_POSITIONS[1]);
const mediaTypeSchema = v.fallback(v.picklist(MEDIA_TYPES), MEDIA_TYPES[0]);
const mediaPopOverSchema = v.boolean();
const mediaHasTransparencySchema = v.boolean();

// TEXT SCHEMAS
const titleSchema = (index?: number) =>
    v.pipe(v.string(), v.maxLength(MAX_BLOCK_TITLE_LENGTH, errorMessages.title.tooLong(MAX_BLOCK_TITLE_LENGTH, index)));
const textSchema = (index?: number) => v.pipe(v.string(), v.nonEmpty(errorMessages.content.empty(index)), v.maxLength(MAX_BLOCK_DESCRIPTION_LENGTH));
const textAlignSchema = v.fallback(v.picklist(TEXT_ALIGNS), TEXT_ALIGNS[0]);
const textVAlignSchema = v.fallback(v.picklist(TEXT_V_ALIGNS), TEXT_V_ALIGNS[0]);

// BLOCK SCHEMAS
const MEDIA_TEXT_SCHEMA = v.object({
    mediaSrc: mediaSrcSchema(),
    mediaMaxHeight: maxHeightSchema,
    mediaPosition: mediaPositionSchema,
    mediaType: mediaTypeSchema,
    mediaPopOver: mediaPopOverSchema,
    mediaHasTransparency: mediaHasTransparencySchema,

    title: titleSchema(),
    text: textSchema(),
    textAlign: textAlignSchema,
    textVAlign: textVAlignSchema,
});

const SINGLE_MEDIA_SCHEMA = v.object({
    mediaSrc: mediaSrcSchema(),
    mediaMaxHeight: maxHeightSchema,
    mediaPosition: mediaPositionSchema,
    mediaType: mediaTypeSchema,
    mediaPopOver: mediaPopOverSchema,
    mediaHasTransparency: mediaHasTransparencySchema,
});

const DOUBLE_MEDIA_SCHEMA = v.object({
    media1Src: mediaSrcSchema(1),
    media1MaxHeight: maxHeightSchema,
    media1Position: mediaPositionSchema,
    media1Type: mediaTypeSchema,
    media1PopOver: mediaPopOverSchema,
    media1HasTransparency: mediaHasTransparencySchema,

    media2Src: mediaSrcSchema(2),
    media2MaxHeight: maxHeightSchema,
    media2Position: mediaPositionSchema,
    media2Type: mediaTypeSchema,
    media2PopOver: mediaPopOverSchema,
    media2HasTransparency: mediaHasTransparencySchema,
});

const TRIPLE_MEDIA_SCHEMA = v.object({
    media1Src: mediaSrcSchema(1),
    media1MaxHeight: maxHeightSchema,
    media1Position: mediaPositionSchema,
    media1Type: mediaTypeSchema,
    media1PopOver: mediaPopOverSchema,
    media1HasTransparency: mediaHasTransparencySchema,

    media2Src: mediaSrcSchema(2),
    media2MaxHeight: maxHeightSchema,
    media2Position: mediaPositionSchema,
    media2Type: mediaTypeSchema,
    media2PopOver: mediaPopOverSchema,
    media2HasTransparency: mediaHasTransparencySchema,

    media3Src: mediaSrcSchema(3),
    media3MaxHeight: maxHeightSchema,
    media3Position: mediaPositionSchema,
    media3Type: mediaTypeSchema,
    media3PopOver: mediaPopOverSchema,
    media3HasTransparency: mediaHasTransparencySchema,
});

const SINGLE_TEXT_SCHEMA = v.object({
    title: titleSchema(),
    text: textSchema(),
    textAlign: textAlignSchema,
    textVAlign: textVAlignSchema,
});

const DOUBLE_TEXT_SCHEMA = v.object({
    title1: titleSchema(1),
    text1: textSchema(1),
    textAlign1: textAlignSchema,
    textVAlign1: textVAlignSchema,

    title2: titleSchema(2),
    text2: textSchema(2),
    textAlign2: textAlignSchema,
    textVAlign2: textVAlignSchema,
});

const TRIPLE_TEXT_SCHEMA = v.object({
    title1: titleSchema(1),
    text1: textSchema(1),
    textAlign1: textAlignSchema,
    textVAlign1: textVAlignSchema,

    title2: titleSchema(2),
    text2: textSchema(2),
    textAlign2: textAlignSchema,
    textVAlign2: textVAlignSchema,

    title3: titleSchema(3),
    text3: textSchema(3),
    textAlign3: textAlignSchema,
    textVAlign3: textVAlignSchema,
});

// DEFAULT VALUES
export type MEDIA_TEXT_TYPE = v.InferOutput<typeof MEDIA_TEXT_SCHEMA>;
const DEF_MEDIA_TEXT: MEDIA_TEXT_TYPE = {
    mediaSrc: "",
    mediaMaxHeight: MAX_IMAGE_BLOCK_HEIGHT,
    mediaPosition: MEDIA_POSITIONS[1],
    mediaType: MEDIA_TYPES[0],
    mediaPopOver: false,
    mediaHasTransparency: false,

    title: "",
    text: "Contenido",
    textAlign: TEXT_ALIGNS[0],
    textVAlign: TEXT_V_ALIGNS[0],
};

// Same type as MEDIA_TEXT for now
const DEF_TEXT_MEDIA: MEDIA_TEXT_TYPE = {
    mediaSrc: "",
    mediaMaxHeight: MAX_IMAGE_BLOCK_HEIGHT,
    mediaPosition: MEDIA_POSITIONS[1],
    mediaType: MEDIA_TYPES[0],
    mediaPopOver: false,
    mediaHasTransparency: false,
    title: "Título",
    text: "Contenido",
    textAlign: TEXT_ALIGNS[2],
    textVAlign: TEXT_V_ALIGNS[0],
};
export type SINGLE_MEDIA_TYPE = v.InferOutput<typeof SINGLE_MEDIA_SCHEMA>;
const DEF_SINGLE_MEDIA: SINGLE_MEDIA_TYPE = {
    mediaSrc: "",
    mediaMaxHeight: MAX_IMAGE_BLOCK_HEIGHT,
    mediaPosition: MEDIA_POSITIONS[1],
    mediaType: MEDIA_TYPES[0],
    mediaPopOver: false,
    mediaHasTransparency: false,
};

export type DOUBLE_MEDIA_TYPE = v.InferOutput<typeof DOUBLE_MEDIA_SCHEMA>;
const DEF_DOUBLE_MEDIA: DOUBLE_MEDIA_TYPE = {
    media1Src: "",
    media1MaxHeight: MAX_IMAGE_BLOCK_HEIGHT,
    media1Position: MEDIA_POSITIONS[1],
    media1Type: MEDIA_TYPES[0],
    media1PopOver: false,
    media1HasTransparency: false,

    media2Src: "",
    media2MaxHeight: MAX_IMAGE_BLOCK_HEIGHT,
    media2Position: MEDIA_POSITIONS[1],
    media2Type: MEDIA_TYPES[0],
    media2PopOver: false,
    media2HasTransparency: false,
};

export type TRIPLE_MEDIA_TYPE = v.InferOutput<typeof TRIPLE_MEDIA_SCHEMA>;
const DEF_TRIPLE_MEDIA: TRIPLE_MEDIA_TYPE = {
    media1Src: "",
    media1MaxHeight: MAX_IMAGE_BLOCK_HEIGHT,
    media1Position: MEDIA_POSITIONS[1],
    media1Type: MEDIA_TYPES[0],
    media1PopOver: false,
    media1HasTransparency: false,

    media2Src: "",
    media2MaxHeight: MAX_IMAGE_BLOCK_HEIGHT,
    media2Position: MEDIA_POSITIONS[1],
    media2Type: MEDIA_TYPES[0],
    media2PopOver: false,
    media2HasTransparency: false,

    media3Src: "",
    media3MaxHeight: MAX_IMAGE_BLOCK_HEIGHT,
    media3Position: MEDIA_POSITIONS[1],
    media3Type: MEDIA_TYPES[0],
    media3PopOver: false,
    media3HasTransparency: false,
};
export type SINGLE_TEXT_TYPE = v.InferOutput<typeof SINGLE_TEXT_SCHEMA>;
const DEF_SINGLE_TEXT: SINGLE_TEXT_TYPE = {
    title: "",
    text: "Contenido",
    textAlign: TEXT_ALIGNS[1],
    textVAlign: TEXT_V_ALIGNS[0],
};

export type DOUBLE_TEXT_TYPE = v.InferOutput<typeof DOUBLE_TEXT_SCHEMA>;
const DEF_DOUBLE_TEXT: DOUBLE_TEXT_TYPE = {
    title1: "",
    text1: "Contenido",
    textAlign1: TEXT_ALIGNS[1],
    textVAlign1: TEXT_V_ALIGNS[0],

    title2: "",
    text2: "Contenido",
    textAlign2: TEXT_ALIGNS[1],
    textVAlign2: TEXT_V_ALIGNS[0],
};
export type TRIPLE_TEXT_TYPE = v.InferOutput<typeof TRIPLE_TEXT_SCHEMA>;
const DEF_TRIPLE_TEXT: TRIPLE_TEXT_TYPE = {
    title1: "",
    text1: "Contenido",
    textAlign1: TEXT_ALIGNS[1],
    textVAlign1: TEXT_V_ALIGNS[0],

    title2: "",
    text2: "Contenido",
    textAlign2: TEXT_ALIGNS[1],
    textVAlign2: TEXT_V_ALIGNS[0],

    title3: "",
    text3: "Contenido",
    textAlign3: TEXT_ALIGNS[1],
    textVAlign3: TEXT_V_ALIGNS[0],
};

export enum BLOCKTYPE {
    MEDIA_TEXT = 1,
    TEXT_MEDIA,
    SINGLE_MEDIA,
    DOUBLE_MEDIA,
    TRIPLE_MEDIA,
    SINGLE_TEXT,
    DOUBLE_TEXT,
    TRIPLE_TEXT
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
    departmentId: v.nullable(v.pipe(v.number(), v.notValue(0))),
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
    id: string;
    blob: Blob;
};
export type TFG_BLockElement = {
    type: BLOCKTYPE;
    data: string;
};
export interface BlockInfo extends TFG_BLockElement {
    id: number;
    files: iFile[];
    errors: string[];
}
export type DetailsProps = {
    blocks: TFG_BLockElement[];
};

type _BLOCK_DATA = {
    element: ({ data }: BlockParams) => JSX.Element;
    DEF_VALUES: string;
    prepareForLocalStorage: (data: string) => string;
    VALIDATE: (data: string | object) => v.SafeParseResult<any>;
    getFileNames: (source: string) => string[];
};

interface BLOCK_DATA_TYPE {
    [key: string]: _BLOCK_DATA;
}

export const BLOCKSCHEMA: BLOCK_DATA_TYPE = {
    [BLOCKTYPE.MEDIA_TEXT]: {
        element: MEDIA_TEXT_ELEMENT,
        DEF_VALUES: JSON.stringify(DEF_MEDIA_TEXT),
        prepareForLocalStorage: (source: string) => {
            const data = JSON.parse(source) as MEDIA_TEXT_TYPE;
            data.mediaSrc = data.mediaSrc.startsWith("data:") ? localStorageBlob : data.mediaSrc;
            return JSON.stringify(data);
        },
        getFileNames: (source: string) => {
            const data = JSON.parse(source) as MEDIA_TEXT_TYPE;
            return [data.mediaSrc];
        },
        VALIDATE: (data: string | object) => v.safeParse(MEDIA_TEXT_SCHEMA, typeof data === "string" ? JSON.parse(data) : data),
    },
    [BLOCKTYPE.TEXT_MEDIA]: {
        element: TEXT_MEDIA_ELEMENT,
        DEF_VALUES: JSON.stringify(DEF_TEXT_MEDIA),
        prepareForLocalStorage: (source: string) => {
            const data = JSON.parse(source) as MEDIA_TEXT_TYPE;
            data.mediaSrc = data.mediaSrc.startsWith("data:") ? localStorageBlob : data.mediaSrc;
            return JSON.stringify(data);
        },
        getFileNames: (source: string) => {
            const data = JSON.parse(source) as MEDIA_TEXT_TYPE;
            return [data.mediaSrc];
        },
        VALIDATE: (data: string | object) => v.safeParse(MEDIA_TEXT_SCHEMA, typeof data === "string" ? JSON.parse(data) : data),
    },
    [BLOCKTYPE.SINGLE_MEDIA]: {
        element: SINGLE_MEDIA_ELEMENT,
        DEF_VALUES: JSON.stringify(DEF_SINGLE_MEDIA),
        prepareForLocalStorage: (source: string) => {
            const data = JSON.parse(source) as SINGLE_MEDIA_TYPE;
            data.mediaSrc = data.mediaSrc.startsWith("data:") ? localStorageBlob : data.mediaSrc;
            return JSON.stringify(data);
        },
        getFileNames: (source: string) => {
            const data = JSON.parse(source) as SINGLE_MEDIA_TYPE;
            return [data.mediaSrc];
        },
        VALIDATE: (data: string | object) => v.safeParse(SINGLE_MEDIA_SCHEMA, typeof data === "string" ? JSON.parse(data) : data),
    },
    [BLOCKTYPE.DOUBLE_MEDIA]: {
        element: DOUBLE_MEDIA_ELEMENT,
        DEF_VALUES: JSON.stringify(DEF_DOUBLE_MEDIA),
        prepareForLocalStorage: (source: string) => {
            const data = JSON.parse(source) as DOUBLE_MEDIA_TYPE;
            data.media1Src = data.media1Src.startsWith("data:") ? localStorageBlob : data.media1Src;
            data.media2Src = data.media2Src.startsWith("data:") ? localStorageBlob : data.media2Src;
            return JSON.stringify(data);
        },
        getFileNames: (source: string) => {
            const data = JSON.parse(source) as DOUBLE_MEDIA_TYPE;
            return [data.media1Src, data.media2Src];
        },
        VALIDATE: (data: string | object) => v.safeParse(DOUBLE_MEDIA_SCHEMA, typeof data === "string" ? JSON.parse(data) : data),
    },
    [BLOCKTYPE.TRIPLE_MEDIA]: {
        element: TRIPLE_MEDIA_ELEMENT,
        DEF_VALUES: JSON.stringify(DEF_TRIPLE_MEDIA),
        prepareForLocalStorage: (source: string) => {
            const data = JSON.parse(source) as TRIPLE_MEDIA_TYPE;
            data.media1Src = data.media1Src.startsWith("data:") ? localStorageBlob : data.media1Src;
            data.media2Src = data.media2Src.startsWith("data:") ? localStorageBlob : data.media2Src;
            data.media3Src = data.media3Src.startsWith("data:") ? localStorageBlob : data.media3Src;
            return JSON.stringify(data);
        },
        getFileNames: (source: string) => {
            const data = JSON.parse(source) as TRIPLE_MEDIA_TYPE;
            return [data.media1Src, data.media2Src, data.media3Src];
        },
        VALIDATE: (data: string | object) => v.safeParse(TRIPLE_MEDIA_SCHEMA, typeof data === "string" ? JSON.parse(data) : data),
    },
    [BLOCKTYPE.SINGLE_TEXT]: {
        element: SINGLE_TEXT_ELEMENT,
        DEF_VALUES: JSON.stringify(DEF_SINGLE_TEXT),
        prepareForLocalStorage: (source: string) => {
            return source;
        },
        getFileNames(source) {
            return [];
        },
        VALIDATE: (data: string | object) => v.safeParse(SINGLE_TEXT_SCHEMA, typeof data === "string" ? JSON.parse(data) : data),
    },
    [BLOCKTYPE.DOUBLE_TEXT]: {
        element: DOUBLE_TEXT_ELEMENT,
        DEF_VALUES: JSON.stringify(DEF_DOUBLE_TEXT),
        prepareForLocalStorage: (source: string) => {
            return source;
        },
        getFileNames(source) {
            return [];
        },
        VALIDATE: (data: string | object) => v.safeParse(DOUBLE_TEXT_SCHEMA, typeof data === "string" ? JSON.parse(data) : data),
    },
    [BLOCKTYPE.TRIPLE_TEXT]: {
        element: TRIPLE_TEXT_ELEMENT,
        DEF_VALUES: JSON.stringify(DEF_TRIPLE_TEXT),
        prepareForLocalStorage: (source: string) => {
            return source;
        },
        getFileNames(source) {
            return [];
        },
        VALIDATE: (data: string | object) => v.safeParse(TRIPLE_TEXT_SCHEMA, typeof data === "string" ? JSON.parse(data) : data),
    },
};

export type savedImageInfoType = {
    banner: boolean;
    thumbnail: boolean;
    content: number[];
};
