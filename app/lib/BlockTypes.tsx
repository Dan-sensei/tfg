import Image from "next/image";
import { MEDIATXT_SLOTS, MEDIA_TEXT, TEXT_MEDIA } from "../components/TFG_BlockDefinitions/MEDIA_TEXT";

const SINGLE_IMAGE = ({ content }: { content: string[] }) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    return (
        <div style={{ height: `${height}px` }} className="relative min-h-[30px]">
            <img src={imageLink} className={`object-${imageDisplay} object-${imagePosition} rounded-lg shadow-light-dark`} alt="" />
        </div>
    );
};

const DOUBLE_IMAGE = ({ content }: { content: string[] }) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    const image2Display = content[4];
    const image2Position = content[5];
    const image2Link = content[6];
    return (
        <div className="min-h-[30px] gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2">
            <div style={{ height: `${height}px` }} className="relative">
                <img src={imageLink} className={`object-${imageDisplay} object-${imagePosition} rounded-lg shadow-light-dark`} alt="" />
            </div>
            <div style={{ height: `${height}px` }} className="relative">
                <img src={image2Link} className={`object-${image2Display} object-${image2Position} rounded-lg shadow-light-dark`} alt="" />
            </div>
        </div>
    );
};

const TRIPLE_IMAGE = ({ content }: { content: string[] }) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    const image2Display = content[4];
    const image2Position = content[5];
    const image2Link = content[6];
    const image3Display = content[7];
    const image3Position = content[8];
    const image3Link = content[9];
    return (
        <div className="min-h-[30px] grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8">
            <div style={{ height: `${height}px` }} className="relative">
                <img src={imageLink} className={`object-${imageDisplay} object-${imagePosition} rounded-lg shadow-light-dark`} alt="" />
            </div>
            <div style={{ height: `${height}px` }} className="relative">
                <img src={image2Link} className={`object-${image2Display} object-${image2Position} rounded-lg shadow-light-dark`} alt="" />
            </div>
            <div
                style={{
                    height: `${height}px`,
                }}
                className="relative">
                <img src={image3Link} className={`object-${image3Display} object-${image3Position} rounded-lg shadow-light-dark`} alt="" />
            </div>
        </div>
    );
};
const SINGLE_TEXT = ({ content }: { content: string[] }) => {
    const title1 = content[0];
    const text1 = content[1];
    return (
        <div className="flex gap-3 xl:gap-8 min-h-[30px] text-justify">
            <div className="">
                <div className="text-3xl">{title1}</div>
                <div className="">{text1}</div>
            </div>
        </div>
    );
};

const DOUBLE_TEXT = ({ content }: { content: string[] }) => {
    const title1 = content[0];
    const text1 = content[1];
    const title2 = content[2];
    const text2 = content[3];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8 min-h-[30px] text-justify">
            <div className="">
                <div className="text-3xl">{title1}</div>
                <div className="">{text1}</div>
            </div>
            <div className="">
                <div className="text-3xl">{title2}</div>
                <div className="">{text2}</div>
            </div>
        </div>
    );
};

const TRIPLE_TEXT = ({ content }: { content: string[] }) => {
    const title1 = content[0];
    const text1 = content[1];
    const title2 = content[2];
    const text2 = content[3];
    const title3 = content[4];
    const text3 = content[5];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8 min-h-[30px] text-justify">
            <div className="">
                <div className="text-3xl">{title1}</div>
                <div className="">{text1}</div>
            </div>
            <div className="">
                <div className="text-3xl">{title2}</div>
                <div className="">{text2}</div>
            </div>
            <div className="">
                <div className="text-3xl">{title3}</div>
                <div className="">{text3}</div>
            </div>
        </div>
    );
};

type ComponentFunction = {
    element: (props: { content: string[] }) => JSX.Element;
    expectedParameters: number;
};
interface DetailsTypes {
    [key: string]: ComponentFunction;
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

export type TFG_BLockElement = {
    type: BLOCKTYPE;
    content: string[];
};

export type iFile = {
    id: number;
    file: File;
};
export interface BlockInfo extends TFG_BLockElement {
    id: number;
    files: iFile[];
}
export type DetailsProps = {
    blocks: TFG_BLockElement[];
};

type DefBlockValue = {
    [key: string]: string;
};

type SkipUnless = {
    skip: number;
    unless: number[];
};

type _BLOCK_DATA = {
    element: (props: { content: string[] }) => JSX.Element;
    DEF_VALUES: DefBlockValue;
    SKIP_LOCAL_SAVE_UNLESS: SkipUnless[];
    expectedParameters: number;
};
interface _BLOCK_DATA_TYPE {
    [key: string]: _BLOCK_DATA;
}
export const BLOCKDATA: _BLOCK_DATA_TYPE = {
    [BLOCKTYPE.MEDIA_TEXT]: {
        element: MEDIA_TEXT,
        DEF_VALUES: {
            [MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT]: "800",
            [MEDIATXT_SLOTS.MEDIA_POSITION]: "lg:mx-auto",
            [MEDIATXT_SLOTS.MEDIA_TYPE]: "image",
            [MEDIATXT_SLOTS.MEDIA_SRC]: "",
            [MEDIATXT_SLOTS.IMG_MODAL_CLICK]: "true",
            [MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY]: "false",
            [MEDIATXT_SLOTS.TEXT_POSITION]: "lg:items-start",
            [MEDIATXT_SLOTS.TEXT]: "",
            [MEDIATXT_SLOTS.IMG_SRC_LINK]: "",
            [MEDIATXT_SLOTS.VID_SRC_LINK]: "",
        },
        SKIP_LOCAL_SAVE_UNLESS: [{ skip: MEDIATXT_SLOTS.MEDIA_SRC, unless: [MEDIATXT_SLOTS.IMG_SRC_LINK] }],
        expectedParameters: MEDIATXT_SLOTS.__LENGTH,
    },
};

export type savedImageInfoType = {
    banner: boolean;
    thumbnail: boolean;
    content: number[];
};
