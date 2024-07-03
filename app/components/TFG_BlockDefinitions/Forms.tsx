import { Divider } from "@nextui-org/divider";
import {
    DOUBLE_MEDIA_SLOTS,
    DOUBLE_TEXT_SLOTS,
    MEDIATXT_SLOTS,
    SINGLE_MEDIA_SLOTS,
    SINGLE_TEXT_SLOTS,
    TRIPLE_MEDIA_SLOTS,
    TRIPLE_TEXT_SLOTS,
} from "./BlockDefs";
import { MediaFormPart, PropsToBlocks, TextFormPart } from "./BlocksShared";

export const MEDIA_TEXT_FORM = (propsToBlocks: PropsToBlocks) => {
    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <MediaFormPart
                blockProps={propsToBlocks}
                MEDIA_SRC={MEDIATXT_SLOTS.MEDIA_SRC}
                IMG_HAS_TRANSPARENCY={MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={MEDIATXT_SLOTS.IMG_MODAL_CLICK}
                IMG_SRC_LINK={MEDIATXT_SLOTS.IMG_SRC_LINK}
                MEDIA_MAX_HEIGHT={MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT}
                MEDIA_POSITION={MEDIATXT_SLOTS.MEDIA_POSITION}
                MEDIA_TYPE={MEDIATXT_SLOTS.MEDIA_TYPE}
                VID_SRC_LINK={MEDIATXT_SLOTS.VID_SRC_LINK}
                IMAGE_DROP_INDEX={MEDIATXT_SLOTS.MEDIA_SRC}
            />
            <Divider className="" />
            <TextFormPart
                blockProps={propsToBlocks}
                PositionText="derecha"
                TEXT={MEDIATXT_SLOTS.TEXT}
                TEXT_TITLE={MEDIATXT_SLOTS.TEXT_TITLE}
                TEXT_ALIGN={MEDIATXT_SLOTS.TEXT_ALIGN}
                TEXT_POSITION={MEDIATXT_SLOTS.TEXT_POSITION}
            />
        </div>
    );
};

export const TEXT_MEDIA_FORM = (propsToBlocks: PropsToBlocks) => {
    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <TextFormPart
                blockProps={propsToBlocks}
                PositionText="izquierda"
                TEXT={MEDIATXT_SLOTS.TEXT}
                TEXT_TITLE={MEDIATXT_SLOTS.TEXT_TITLE}
                TEXT_ALIGN={MEDIATXT_SLOTS.TEXT_ALIGN}
                TEXT_POSITION={MEDIATXT_SLOTS.TEXT_POSITION}
            />
            <Divider className="" />
            <MediaFormPart
                blockProps={propsToBlocks}
                MEDIA_SRC={MEDIATXT_SLOTS.MEDIA_SRC}
                IMG_HAS_TRANSPARENCY={MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={MEDIATXT_SLOTS.IMG_MODAL_CLICK}
                IMG_SRC_LINK={MEDIATXT_SLOTS.IMG_SRC_LINK}
                MEDIA_MAX_HEIGHT={MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT}
                MEDIA_POSITION={MEDIATXT_SLOTS.MEDIA_POSITION}
                MEDIA_TYPE={MEDIATXT_SLOTS.MEDIA_TYPE}
                VID_SRC_LINK={MEDIATXT_SLOTS.VID_SRC_LINK}
                IMAGE_DROP_INDEX={MEDIATXT_SLOTS.MEDIA_SRC}
            />
        </div>
    );
};

export const SINGLE_MEDIA_FORM = (propsToBlocks: PropsToBlocks) => {
    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <MediaFormPart
                blockProps={propsToBlocks}
                MEDIA_SRC={SINGLE_MEDIA_SLOTS.MEDIA_SRC}
                IMG_HAS_TRANSPARENCY={SINGLE_MEDIA_SLOTS.IMG_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={SINGLE_MEDIA_SLOTS.IMG_MODAL_CLICK}
                IMG_SRC_LINK={SINGLE_MEDIA_SLOTS.IMG_SRC_LINK}
                MEDIA_MAX_HEIGHT={SINGLE_MEDIA_SLOTS.MEDIA_MAX_HEIGHT}
                MEDIA_POSITION={SINGLE_MEDIA_SLOTS.MEDIA_POSITION}
                MEDIA_TYPE={SINGLE_MEDIA_SLOTS.MEDIA_TYPE}
                VID_SRC_LINK={SINGLE_MEDIA_SLOTS.VID_SRC_LINK}
                IMAGE_DROP_INDEX={SINGLE_MEDIA_SLOTS.MEDIA_SRC}
            />
        </div>
    );
};

export const DOUBLE_MEDIA_FORM = (propsToBlocks: PropsToBlocks) => {
    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <div>Recurso 1</div>
            <MediaFormPart
                blockProps={propsToBlocks}
                MEDIA_SRC={DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC}
                IMG_HAS_TRANSPARENCY={DOUBLE_MEDIA_SLOTS.IMG_1_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={DOUBLE_MEDIA_SLOTS.IMG_1_MODAL_CLICK}
                IMG_SRC_LINK={DOUBLE_MEDIA_SLOTS.IMG_1_SRC_LINK}
                MEDIA_MAX_HEIGHT={DOUBLE_MEDIA_SLOTS.MEDIA_1_MAX_HEIGHT}
                MEDIA_POSITION={DOUBLE_MEDIA_SLOTS.MEDIA_1_POSITION}
                MEDIA_TYPE={DOUBLE_MEDIA_SLOTS.MEDIA_1_TYPE}
                VID_SRC_LINK={DOUBLE_MEDIA_SLOTS.VID_1_SRC_LINK}
                IMAGE_DROP_INDEX={DOUBLE_MEDIA_SLOTS.MEDIA_1_SRC}
            />
            <Divider className="my-3" />
            <div>Recurso 2</div>
            <MediaFormPart
                blockProps={propsToBlocks}
                MEDIA_SRC={DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC}
                IMG_HAS_TRANSPARENCY={DOUBLE_MEDIA_SLOTS.IMG_2_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={DOUBLE_MEDIA_SLOTS.IMG_2_MODAL_CLICK}
                IMG_SRC_LINK={DOUBLE_MEDIA_SLOTS.IMG_2_SRC_LINK}
                MEDIA_MAX_HEIGHT={DOUBLE_MEDIA_SLOTS.MEDIA_2_MAX_HEIGHT}
                MEDIA_POSITION={DOUBLE_MEDIA_SLOTS.MEDIA_2_POSITION}
                MEDIA_TYPE={DOUBLE_MEDIA_SLOTS.MEDIA_2_TYPE}
                VID_SRC_LINK={DOUBLE_MEDIA_SLOTS.VID_2_SRC_LINK}
                IMAGE_DROP_INDEX={DOUBLE_MEDIA_SLOTS.MEDIA_2_SRC}
            />
        </div>
    );
};

export const TRIPLE_MEDIA_FORM = (propsToBlocks: PropsToBlocks) => {
    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <div>Recurso 1</div>
            <MediaFormPart
                blockProps={propsToBlocks}
                MEDIA_SRC={TRIPLE_MEDIA_SLOTS.MEDIA_1_SRC}
                IMG_HAS_TRANSPARENCY={TRIPLE_MEDIA_SLOTS.IMG_1_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={TRIPLE_MEDIA_SLOTS.IMG_1_MODAL_CLICK}
                IMG_SRC_LINK={TRIPLE_MEDIA_SLOTS.IMG_1_SRC_LINK}
                MEDIA_MAX_HEIGHT={TRIPLE_MEDIA_SLOTS.MEDIA_1_MAX_HEIGHT}
                MEDIA_POSITION={TRIPLE_MEDIA_SLOTS.MEDIA_1_POSITION}
                MEDIA_TYPE={TRIPLE_MEDIA_SLOTS.MEDIA_1_TYPE}
                VID_SRC_LINK={TRIPLE_MEDIA_SLOTS.VID_1_SRC_LINK}
                IMAGE_DROP_INDEX={TRIPLE_MEDIA_SLOTS.MEDIA_1_SRC}
            />
            <Divider className="my-3" />
            <div>Recurso 2</div>
            <MediaFormPart
                blockProps={propsToBlocks}
                MEDIA_SRC={TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC}
                IMG_HAS_TRANSPARENCY={TRIPLE_MEDIA_SLOTS.IMG_2_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={TRIPLE_MEDIA_SLOTS.IMG_2_MODAL_CLICK}
                IMG_SRC_LINK={TRIPLE_MEDIA_SLOTS.IMG_2_SRC_LINK}
                MEDIA_MAX_HEIGHT={TRIPLE_MEDIA_SLOTS.MEDIA_2_MAX_HEIGHT}
                MEDIA_POSITION={TRIPLE_MEDIA_SLOTS.MEDIA_2_POSITION}
                MEDIA_TYPE={TRIPLE_MEDIA_SLOTS.MEDIA_2_TYPE}
                VID_SRC_LINK={TRIPLE_MEDIA_SLOTS.VID_2_SRC_LINK}
                IMAGE_DROP_INDEX={TRIPLE_MEDIA_SLOTS.MEDIA_2_SRC}
            />
            <Divider className="my-3" />
            <div>Recurso 3</div>
            <MediaFormPart
                blockProps={propsToBlocks}
                MEDIA_SRC={TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC}
                IMG_HAS_TRANSPARENCY={TRIPLE_MEDIA_SLOTS.IMG_3_HAS_TRANSPARENCY}
                IMG_MODAL_CLICK={TRIPLE_MEDIA_SLOTS.IMG_3_MODAL_CLICK}
                IMG_SRC_LINK={TRIPLE_MEDIA_SLOTS.IMG_3_SRC_LINK}
                MEDIA_MAX_HEIGHT={TRIPLE_MEDIA_SLOTS.MEDIA_3_MAX_HEIGHT}
                MEDIA_POSITION={TRIPLE_MEDIA_SLOTS.MEDIA_3_POSITION}
                MEDIA_TYPE={TRIPLE_MEDIA_SLOTS.MEDIA_3_TYPE}
                VID_SRC_LINK={TRIPLE_MEDIA_SLOTS.VID_3_SRC_LINK}
                IMAGE_DROP_INDEX={TRIPLE_MEDIA_SLOTS.MEDIA_3_SRC}
            />
        </div>
    );
};

export const SINGLE_TEXT_FORM = (propsToBlocks: PropsToBlocks) => {
    return (
        <TextFormPart
            blockProps={propsToBlocks}
            PositionText="derecha"
            TEXT={SINGLE_TEXT_SLOTS.TEXT}
            TEXT_TITLE={SINGLE_TEXT_SLOTS.TEXT_TITLE}
            TEXT_ALIGN={SINGLE_TEXT_SLOTS.TEXT_ALIGN}
        />
    );
};
export const DOUBLE_TEXT_FORM = (propsToBlocks: PropsToBlocks) => {
    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <TextFormPart
                blockProps={propsToBlocks}
                PositionText="derecha"
                TEXT={DOUBLE_TEXT_SLOTS.TEXT_1}
                TEXT_TITLE={DOUBLE_TEXT_SLOTS.TEXT_1_TITLE}
                TEXT_ALIGN={DOUBLE_TEXT_SLOTS.TEXT_1_ALIGN}
                TextName="1"
            />
            <Divider className="my-3" />
            <TextFormPart
                blockProps={propsToBlocks}
                PositionText="derecha"
                TEXT={DOUBLE_TEXT_SLOTS.TEXT_2}
                TEXT_TITLE={DOUBLE_TEXT_SLOTS.TEXT_2_TITLE}
                TEXT_ALIGN={DOUBLE_TEXT_SLOTS.TEXT_2_ALIGN}
                TextName="2"
            />
        </div>
    );
};

export const TRIPLE_TEXT_FORM = (propsToBlocks: PropsToBlocks) => {
    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <TextFormPart
                blockProps={propsToBlocks}
                PositionText="derecha"
                TEXT={TRIPLE_TEXT_SLOTS.TEXT_1}
                TEXT_TITLE={TRIPLE_TEXT_SLOTS.TEXT_1_TITLE}
                TEXT_ALIGN={TRIPLE_TEXT_SLOTS.TEXT_1_ALIGN}
                TextName="1"
            />
            <Divider className="my-3" />
            <TextFormPart
                blockProps={propsToBlocks}
                PositionText="derecha"
                TEXT={TRIPLE_TEXT_SLOTS.TEXT_2}
                TEXT_TITLE={TRIPLE_TEXT_SLOTS.TEXT_2_TITLE}
                TEXT_ALIGN={TRIPLE_TEXT_SLOTS.TEXT_2_ALIGN}
                TextName="2"
            />
            <Divider className="my-3" />
            <TextFormPart
                blockProps={propsToBlocks}
                PositionText="derecha"
                TEXT={TRIPLE_TEXT_SLOTS.TEXT_3}
                TEXT_TITLE={TRIPLE_TEXT_SLOTS.TEXT_3_TITLE}
                TEXT_ALIGN={TRIPLE_TEXT_SLOTS.TEXT_3_ALIGN}
                TextName="3"
            />
        </div>
    );
};
