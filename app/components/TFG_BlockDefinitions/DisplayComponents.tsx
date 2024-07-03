import { DOUBLE_MEDIA_SLOTS, DOUBLE_TEXT_SLOTS, MEDIATXT_SLOTS, SINGLE_MEDIA_SLOTS, SINGLE_TEXT_SLOTS, TRIPLE_MEDIA_SLOTS, TRIPLE_TEXT_SLOTS } from "./BlockDefs";
import { Media, Text } from "./BlocksShared";

type BlockParams = {
    params: string[];
};

export const MEDIA_TEXT = ({ params }: BlockParams) => {
    return (
        <div className={`gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2`}>
            <Media
                params={params}
                MEDIA_SRC={MEDIATXT_SLOTS.MEDIA_SRC}
                IMG_HAS_TRANSPARENCY={MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={MEDIATXT_SLOTS.IMG_MODAL_CLICK}
                MEDIA_MAX_HEIGHT={MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT}
                MEDIA_POSITION={MEDIATXT_SLOTS.MEDIA_POSITION}
                MEDIA_TYPE={MEDIATXT_SLOTS.MEDIA_TYPE}
            />
            <Text
                params={params}
                TEXT={MEDIATXT_SLOTS.TEXT}
                TEXT_TITLE={MEDIATXT_SLOTS.TEXT_TITLE}
                TEXT_ALIGN={MEDIATXT_SLOTS.TEXT_ALIGN}
                TEXT_POSITION={MEDIATXT_SLOTS.TEXT_POSITION}
            />
        </div>
    );
};

export const TEXT_MEDIA = ({ params }: BlockParams) => {
    return (
        <div className={`gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2`}>
            <Text
                params={params}
                TEXT={MEDIATXT_SLOTS.TEXT}
                TEXT_TITLE={MEDIATXT_SLOTS.TEXT_TITLE}
                TEXT_ALIGN={MEDIATXT_SLOTS.TEXT_ALIGN}
                TEXT_POSITION={MEDIATXT_SLOTS.TEXT_POSITION}
            />
            <Media
                params={params}
                MEDIA_SRC={MEDIATXT_SLOTS.MEDIA_SRC}
                IMG_HAS_TRANSPARENCY={MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={MEDIATXT_SLOTS.IMG_MODAL_CLICK}
                MEDIA_MAX_HEIGHT={MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT}
                MEDIA_POSITION={MEDIATXT_SLOTS.MEDIA_POSITION}
                MEDIA_TYPE={MEDIATXT_SLOTS.MEDIA_TYPE}
            />
        </div>
    );
};

export const SINGLE_MEDIA = ({ params }: BlockParams) => {
    return (
        <div>
            <Media
                params={params}
                MEDIA_SRC={SINGLE_MEDIA_SLOTS.MEDIA_SRC}
                IMG_HAS_TRANSPARENCY={SINGLE_MEDIA_SLOTS.IMG_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={SINGLE_MEDIA_SLOTS.IMG_MODAL_CLICK}
                MEDIA_MAX_HEIGHT={SINGLE_MEDIA_SLOTS.MEDIA_MAX_HEIGHT}
                MEDIA_POSITION={SINGLE_MEDIA_SLOTS.MEDIA_POSITION}
                MEDIA_TYPE={SINGLE_MEDIA_SLOTS.MEDIA_TYPE}
            />
        </div>
    );
};

export const DOUBLE_MEDIA = ({ params }: BlockParams) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xl:gap-8">
            <Media
                params={params}
                MEDIA_SRC={DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC}
                IMG_HAS_TRANSPARENCY={DOUBLE_MEDIA_SLOTS.IMG_1_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={DOUBLE_MEDIA_SLOTS.IMG_1_MODAL_CLICK}
                MEDIA_MAX_HEIGHT={DOUBLE_MEDIA_SLOTS.MEDIA_1_MAX_HEIGHT}
                MEDIA_POSITION={DOUBLE_MEDIA_SLOTS.MEDIA_1_POSITION}
                MEDIA_TYPE={DOUBLE_MEDIA_SLOTS.MEDIA_1_TYPE}
            />
            <Media
                params={params}
                MEDIA_SRC={DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC}
                IMG_HAS_TRANSPARENCY={DOUBLE_MEDIA_SLOTS.IMG_2_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={DOUBLE_MEDIA_SLOTS.IMG_2_MODAL_CLICK}
                MEDIA_MAX_HEIGHT={DOUBLE_MEDIA_SLOTS.MEDIA_2_MAX_HEIGHT}
                MEDIA_POSITION={DOUBLE_MEDIA_SLOTS.MEDIA_2_POSITION}
                MEDIA_TYPE={DOUBLE_MEDIA_SLOTS.MEDIA_2_TYPE}
            />
        </div>
    );
};

export const TRIPLE_MEDIA = ({ params }: BlockParams) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8">
            <Media
                params={params}
                MEDIA_SRC={TRIPLE_MEDIA_SLOTS.MEDIA_1_SRC}
                IMG_HAS_TRANSPARENCY={TRIPLE_MEDIA_SLOTS.IMG_1_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={TRIPLE_MEDIA_SLOTS.IMG_1_MODAL_CLICK}
                MEDIA_MAX_HEIGHT={TRIPLE_MEDIA_SLOTS.MEDIA_1_MAX_HEIGHT}
                MEDIA_POSITION={TRIPLE_MEDIA_SLOTS.MEDIA_1_POSITION}
                MEDIA_TYPE={TRIPLE_MEDIA_SLOTS.MEDIA_1_TYPE}
            />
            <Media
                params={params}
                MEDIA_SRC={TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC}
                IMG_HAS_TRANSPARENCY={TRIPLE_MEDIA_SLOTS.IMG_2_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={TRIPLE_MEDIA_SLOTS.IMG_2_MODAL_CLICK}
                MEDIA_MAX_HEIGHT={TRIPLE_MEDIA_SLOTS.MEDIA_2_MAX_HEIGHT}
                MEDIA_POSITION={TRIPLE_MEDIA_SLOTS.MEDIA_2_POSITION}
                MEDIA_TYPE={TRIPLE_MEDIA_SLOTS.MEDIA_2_TYPE}
            />
            <Media
                params={params}
                MEDIA_SRC={TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC}
                IMG_HAS_TRANSPARENCY={TRIPLE_MEDIA_SLOTS.IMG_3_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={TRIPLE_MEDIA_SLOTS.IMG_3_MODAL_CLICK}
                MEDIA_MAX_HEIGHT={TRIPLE_MEDIA_SLOTS.MEDIA_3_MAX_HEIGHT}
                MEDIA_POSITION={TRIPLE_MEDIA_SLOTS.MEDIA_3_POSITION}
                MEDIA_TYPE={TRIPLE_MEDIA_SLOTS.MEDIA_3_TYPE}
            />
        </div>
    );
};

export const SINGLE_TEXT = ({ params }: BlockParams) => {
    return (
            <Text
                params={params}
                TEXT={SINGLE_TEXT_SLOTS.TEXT}
                TEXT_TITLE={SINGLE_TEXT_SLOTS.TEXT_TITLE}
                TEXT_ALIGN={SINGLE_TEXT_SLOTS.TEXT_ALIGN}
            />
    );
};

export const DOUBLE_TEXT = ({ params }: BlockParams) => {
    return (
        <div className={`gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2`}>
            <Text
                params={params}
                TEXT={DOUBLE_TEXT_SLOTS.TEXT_1}
                TEXT_TITLE={DOUBLE_TEXT_SLOTS.TEXT_1_TITLE}
                TEXT_ALIGN={DOUBLE_TEXT_SLOTS.TEXT_1_ALIGN}
            />
            <Text
                params={params}
                TEXT={DOUBLE_TEXT_SLOTS.TEXT_2}
                TEXT_TITLE={DOUBLE_TEXT_SLOTS.TEXT_2_TITLE}
                TEXT_ALIGN={DOUBLE_TEXT_SLOTS.TEXT_2_ALIGN}
            />
        </div>
    );
};

export const TRIPLE_TEXT = ({ params }: BlockParams) => {
    return (
        <div className={`gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-3`}>
            <Text
                params={params}
                TEXT={TRIPLE_TEXT_SLOTS.TEXT_1}
                TEXT_TITLE={TRIPLE_TEXT_SLOTS.TEXT_1_TITLE}
                TEXT_ALIGN={TRIPLE_TEXT_SLOTS.TEXT_1_ALIGN}
            />
            <Text
                params={params}
                TEXT={TRIPLE_TEXT_SLOTS.TEXT_2}
                TEXT_TITLE={TRIPLE_TEXT_SLOTS.TEXT_2_TITLE}
                TEXT_ALIGN={TRIPLE_TEXT_SLOTS.TEXT_2_ALIGN}
            />
            <Text
                params={params}
                TEXT={TRIPLE_TEXT_SLOTS.TEXT_3}
                TEXT_TITLE={TRIPLE_TEXT_SLOTS.TEXT_3_TITLE}
                TEXT_ALIGN={TRIPLE_TEXT_SLOTS.TEXT_3_ALIGN}
            />
        </div>
    );
};