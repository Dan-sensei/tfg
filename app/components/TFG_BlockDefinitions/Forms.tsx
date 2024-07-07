"use client";
import { Divider } from "@nextui-org/divider";

import { MediaFormPart, TextFormPart } from "./BlocksShared";
import {
    DOUBLE_MEDIA_TYPE,
    DOUBLE_TEXT_TYPE,
    iFile,
    MEDIA_TEXT_TYPE,
    SINGLE_MEDIA_TYPE,
    SINGLE_TEXT_TYPE,
    TRIPLE_MEDIA_TYPE,
    TRIPLE_TEXT_TYPE,
} from "./BlockDefs";
import { ProjectFormData } from "@/app/types/interfaces";

export interface BlockMethods {
    removeFileFromBlock: (blockid: number, fileIdToRemove: string) => void;
    addFileToBlock: (blockId: number, file: iFile) => void;
    validateBlock: (blockId: number) => void;
}
export interface BlockProps extends BlockMethods {
    id: number;
    stringifiedData: string;
    updateFormBlock: (blockid: number, content: string) => void;
}

const updateData = <T extends object>(data: T, dataToUpdate: Partial<T>) => {
    return JSON.stringify(Object.assign(data, dataToUpdate));
};

export const MEDIA_TEXT_FORM = ({ id, stringifiedData, updateFormBlock, removeFileFromBlock, addFileToBlock, validateBlock }: BlockProps) => {
    const data = JSON.parse(stringifiedData) as MEDIA_TEXT_TYPE;
    const update = (dataToUpdate: Partial<MEDIA_TEXT_TYPE>) => updateFormBlock(id, updateData(data, dataToUpdate));
    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <MediaFormPart<MEDIA_TEXT_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                id={id}
                updateProperties={{
                    hasTransparency: "mediaHasTransparency",
                    maxHeight: "mediaMaxHeight",
                    mediaPosition: "mediaPosition",
                    mediaSrc: "mediaSrc",
                    mediaType: "mediaType",
                    modalPopOver: "mediaPopOver",
                }}
                mediaSrc={data.mediaSrc}
                hasTransparency={data.mediaHasTransparency}
                maxHeight={data.mediaMaxHeight}
                mediaPosition={data.mediaPosition}
                mediaType={data.mediaType}
                modalPopOver={data.mediaPopOver}
            />
            <Divider className="" />
            <TextFormPart<MEDIA_TEXT_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                updateProperties={{
                    text: "text",
                    textAlign: "textAlign",
                    title: "title",
                    textVAlign: "textVAlign",
                }}
                id={id}
                PositionText="derecha"
                text={data.text}
                textAlign={data.textAlign}
                title={data.title}
                textVAlign={data.textVAlign}
            />
        </div>
    );
};

export const TEXT_MEDIA_FORM = ({ id, stringifiedData, updateFormBlock, removeFileFromBlock, addFileToBlock, validateBlock }: BlockProps) => {
    const data = JSON.parse(stringifiedData) as MEDIA_TEXT_TYPE;

    const update = (dataToUpdate: Partial<MEDIA_TEXT_TYPE>) => updateFormBlock(id, updateData(data, dataToUpdate));

    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <TextFormPart<MEDIA_TEXT_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                updateProperties={{
                    text: "text",
                    textAlign: "textAlign",
                    title: "title",
                    textVAlign: "textVAlign",
                }}
                id={id}
                PositionText="izquierda"
                text={data.text}
                textAlign={data.textAlign}
                title={data.title}
                textVAlign={data.textVAlign}
            />
            <Divider className="" />
            <MediaFormPart<MEDIA_TEXT_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                id={id}
                updateProperties={{
                    hasTransparency: "mediaHasTransparency",
                    maxHeight: "mediaMaxHeight",
                    mediaPosition: "mediaPosition",
                    mediaSrc: "mediaSrc",
                    mediaType: "mediaType",
                    modalPopOver: "mediaPopOver",
                }}
                mediaSrc={data.mediaSrc}
                hasTransparency={data.mediaHasTransparency}
                maxHeight={data.mediaMaxHeight}
                mediaPosition={data.mediaPosition}
                mediaType={data.mediaType}
                modalPopOver={data.mediaPopOver}
            />
        </div>
    );
};

export const SINGLE_MEDIA_FORM = ({ id, stringifiedData, updateFormBlock, removeFileFromBlock, addFileToBlock, validateBlock }: BlockProps) => {
    const data = JSON.parse(stringifiedData) as SINGLE_MEDIA_TYPE;
    const update = (dataToUpdate: Partial<SINGLE_MEDIA_TYPE>) => updateFormBlock(id, updateData(data, dataToUpdate));

    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <MediaFormPart<SINGLE_MEDIA_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                id={id}
                updateProperties={{
                    hasTransparency: "mediaHasTransparency",
                    maxHeight: "mediaMaxHeight",
                    mediaPosition: "mediaPosition",
                    mediaSrc: "mediaSrc",
                    mediaType: "mediaType",
                    modalPopOver: "mediaPopOver",
                }}
                mediaSrc={data.mediaSrc}
                hasTransparency={data.mediaHasTransparency}
                maxHeight={data.mediaMaxHeight}
                mediaPosition={data.mediaPosition}
                mediaType={data.mediaType}
                modalPopOver={data.mediaPopOver}
            />
        </div>
    );
};

export const DOUBLE_MEDIA_FORM = ({ id, stringifiedData, updateFormBlock, removeFileFromBlock, addFileToBlock, validateBlock }: BlockProps) => {
    const data = JSON.parse(stringifiedData) as DOUBLE_MEDIA_TYPE;
    const update = (dataToUpdate: Partial<DOUBLE_MEDIA_TYPE>) => updateFormBlock(id, updateData(data, dataToUpdate));

    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <div>Recurso 1</div>
            <MediaFormPart
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                id={id}
                updateProperties={{
                    hasTransparency: "media1HasTransparency",
                    maxHeight: "media1MaxHeight",
                    mediaPosition: "media1Position",
                    mediaSrc: "media1Src",
                    mediaType: "media1Type",
                    modalPopOver: "media1PopOver",
                }}
                mediaSrc={data.media1Src}
                hasTransparency={data.media1HasTransparency}
                maxHeight={data.media1MaxHeight}
                mediaPosition={data.media1Position}
                mediaType={data.media1Type}
                modalPopOver={data.media1PopOver}
            />
            <Divider className="my-3" />
            <div>Recurso 2</div>
            <MediaFormPart
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                id={id}
                updateProperties={{
                    hasTransparency: "media2HasTransparency",
                    maxHeight: "media2MaxHeight",
                    mediaPosition: "media2Position",
                    mediaSrc: "media2Src",
                    mediaType: "media2Type",
                    modalPopOver: "media2PopOver",
                }}
                mediaSrc={data.media2Src}
                hasTransparency={data.media2HasTransparency}
                maxHeight={data.media2MaxHeight}
                mediaPosition={data.media2Position}
                mediaType={data.media2Type}
                modalPopOver={data.media2PopOver}
            />
        </div>
    );
};

export const TRIPLE_MEDIA_FORM = ({ id, stringifiedData, updateFormBlock, removeFileFromBlock, addFileToBlock, validateBlock }: BlockProps) => {
    const data = JSON.parse(stringifiedData) as TRIPLE_MEDIA_TYPE;
    const update = (dataToUpdate: Partial<TRIPLE_MEDIA_TYPE>) => updateFormBlock(id, updateData(data, dataToUpdate));

    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <div>Recurso 1</div>
            <MediaFormPart<TRIPLE_MEDIA_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                id={id}
                updateProperties={{
                    hasTransparency: "media1HasTransparency",
                    maxHeight: "media1MaxHeight",
                    mediaPosition: "media1Position",
                    mediaSrc: "media1Src",
                    mediaType: "media1Type",
                    modalPopOver: "media1PopOver",
                }}
                mediaSrc={data.media1Src}
                hasTransparency={data.media1HasTransparency}
                maxHeight={data.media1MaxHeight}
                mediaPosition={data.media1Position}
                mediaType={data.media1Type}
                modalPopOver={data.media1PopOver}
            />
            <Divider className="my-3" />
            <div>Recurso 2</div>
            <MediaFormPart<TRIPLE_MEDIA_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                id={id}
                updateProperties={{
                    hasTransparency: "media2HasTransparency",
                    maxHeight: "media2MaxHeight",
                    mediaPosition: "media2Position",
                    mediaSrc: "media2Src",
                    mediaType: "media2Type",
                    modalPopOver: "media2PopOver",
                }}
                mediaSrc={data.media2Src}
                hasTransparency={data.media2HasTransparency}
                maxHeight={data.media2MaxHeight}
                mediaPosition={data.media2Position}
                mediaType={data.media2Type}
                modalPopOver={data.media2PopOver}
            />
            <Divider className="my-3" />
            <div>Recurso 3</div>
            <MediaFormPart<TRIPLE_MEDIA_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                id={id}
                updateProperties={{
                    hasTransparency: "media3HasTransparency",
                    maxHeight: "media3MaxHeight",
                    mediaPosition: "media3Position",
                    mediaSrc: "media3Src",
                    mediaType: "media3Type",
                    modalPopOver: "media3PopOver",
                }}
                mediaSrc={data.media3Src}
                hasTransparency={data.media3HasTransparency}
                maxHeight={data.media3MaxHeight}
                mediaPosition={data.media3Position}
                mediaType={data.media3Type}
                modalPopOver={data.media3PopOver}
            />
        </div>
    );
};

export const SINGLE_TEXT_FORM = ({ id, stringifiedData, updateFormBlock, removeFileFromBlock, addFileToBlock, validateBlock }: BlockProps) => {
    const data = JSON.parse(stringifiedData) as SINGLE_TEXT_TYPE;
    const update = (dataToUpdate: Partial<SINGLE_TEXT_TYPE>) => updateFormBlock(id, updateData(data, dataToUpdate));

    return (
        <TextFormPart
            blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
            updateData={update}
            updateProperties={{
                text: "text",
                textAlign: "textAlign",
                title: "title",
                textVAlign: "textVAlign",
            }}
            id={id}
            PositionText="derecha"
            text={data.text}
            textAlign={data.textAlign}
            title={data.title}
            textVAlign={data.textVAlign}
        />
    );
};
export const DOUBLE_TEXT_FORM = ({ id, stringifiedData, updateFormBlock, removeFileFromBlock, addFileToBlock, validateBlock }: BlockProps) => {
    const data = JSON.parse(stringifiedData) as DOUBLE_TEXT_TYPE;
    const update = (dataToUpdate: Partial<DOUBLE_TEXT_TYPE>) => updateFormBlock(id, updateData(data, dataToUpdate));

    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <TextFormPart<DOUBLE_TEXT_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                updateProperties={{
                    text: "text1",
                    textAlign: "textAlign1",
                    title: "title1",
                    textVAlign: "textVAlign1",
                }}
                id={id}
                PositionText="derecha"
                text={data.text1}
                textAlign={data.textAlign1}
                title={data.title1}
                textVAlign={data.textVAlign1}
                TextName="1"
            />
            <Divider className="my-3" />
            <TextFormPart<DOUBLE_TEXT_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                updateProperties={{
                    text: "text2",
                    textAlign: "textAlign2",
                    title: "title2",
                    textVAlign: "textVAlign2",
                }}
                id={id}
                PositionText="derecha"
                text={data.text2}
                textAlign={data.textAlign2}
                title={data.title2}
                textVAlign={data.textVAlign2}
                TextName="2"
            />
        </div>
    );
};

export const TRIPLE_TEXT_FORM = ({ id, stringifiedData, updateFormBlock, removeFileFromBlock, addFileToBlock, validateBlock }: BlockProps) => {
    const data = JSON.parse(stringifiedData) as TRIPLE_TEXT_TYPE;
    const update = (dataToUpdate: Partial<TRIPLE_TEXT_TYPE>) => updateFormBlock(id, updateData(data, dataToUpdate));

    return (
        <div className={`min-h-[30px] flex flex-col gap-3 pt-2`}>
            <TextFormPart<TRIPLE_TEXT_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                updateProperties={{
                    text: "text1",
                    textAlign: "textAlign1",
                    title: "title1",
                    textVAlign: "textVAlign1",
                }}
                id={id}
                PositionText="derecha"
                text={data.text1}
                textAlign={data.textAlign1}
                title={data.title1}
                textVAlign={data.textVAlign1}
                TextName="1"
            />
            <Divider className="my-3" />
            <TextFormPart<TRIPLE_TEXT_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                updateProperties={{
                    text: "text2",
                    textAlign: "textAlign2",
                    title: "title2",
                    textVAlign: "textVAlign2",
                }}
                id={id}
                PositionText="derecha"
                text={data.text2}
                textAlign={data.textAlign2}
                title={data.title2}
                textVAlign={data.textVAlign2}
                TextName="2"
            />
            <Divider className="my-3" />
            <TextFormPart<TRIPLE_TEXT_TYPE>
                blockMethods={{ removeFileFromBlock, addFileToBlock, validateBlock }}
                updateData={update}
                updateProperties={{
                    text: "text3",
                    textAlign: "textAlign3",
                    title: "title3",
                    textVAlign: "textVAlign3",
                }}
                id={id}
                PositionText="derecha"
                text={data.text3}
                textAlign={data.textAlign3}
                title={data.title3}
                textVAlign={data.textVAlign3}
                TextName="3"
            />
        </div>
    );
};
