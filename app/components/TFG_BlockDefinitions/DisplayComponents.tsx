import {
    DOUBLE_MEDIA_TYPE,
    DOUBLE_TEXT_TYPE,
    MEDIA_TEXT_TYPE,
    SINGLE_MEDIA_TYPE,
    SINGLE_TEXT_TYPE,
    TRIPLE_MEDIA_TYPE,
    TRIPLE_TEXT_TYPE,
} from "./BlockDefs";
import { Media, Text } from "./BlocksShared";

export type BlockParams = {
    data: any;
};

export const MEDIA_TEXT_ELEMENT = ({ data }: BlockParams) => {
    const convertedData = data as MEDIA_TEXT_TYPE;
    return (
        <div className={`gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2`}>
            <Media
                hasTransparency={convertedData.mediaHasTransparency}
                mediaMaxHeight={convertedData.mediaMaxHeight}
                mediaPosition={convertedData.mediaPosition}
                mediaSrc={convertedData.mediaSrc}
                mediaType={convertedData.mediaType}
                modalPopOver={convertedData.mediaPopOver}
            />
            <Text align={convertedData.textAlign} valign={convertedData.textVAlign} text={convertedData.text} title={convertedData.title} />
        </div>
    );
};

export const TEXT_MEDIA_ELEMENT = ({ data }: BlockParams) => {
    const convertedData = data as MEDIA_TEXT_TYPE;

    return (
        <div className={`gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2`}>
            <Text align={convertedData.textAlign} valign={convertedData.textVAlign} text={convertedData.text} title={convertedData.title} />
            <Media
                hasTransparency={convertedData.mediaHasTransparency}
                mediaMaxHeight={convertedData.mediaMaxHeight}
                mediaPosition={convertedData.mediaPosition}
                mediaSrc={convertedData.mediaSrc}
                mediaType={convertedData.mediaType}
                modalPopOver={convertedData.mediaPopOver}
            />
        </div>
    );
};

export const SINGLE_MEDIA_ELEMENT = ({ data }: BlockParams) => {
    const convertedData = data as SINGLE_MEDIA_TYPE;

    return (
        <div>
            <Media
                hasTransparency={convertedData.mediaHasTransparency}
                mediaMaxHeight={convertedData.mediaMaxHeight}
                mediaPosition={convertedData.mediaPosition}
                mediaSrc={convertedData.mediaSrc}
                mediaType={convertedData.mediaType}
                modalPopOver={convertedData.mediaPopOver}
            />
        </div>
    );
};

export const DOUBLE_MEDIA_ELEMENT = ({ data }: BlockParams) => {
    const convertedData = data as DOUBLE_MEDIA_TYPE;
    console.log("convertedData", convertedData)
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xl:gap-8">
            <Media
                hasTransparency={convertedData.media1HasTransparency}
                mediaMaxHeight={convertedData.media1MaxHeight}
                mediaPosition={convertedData.media1Position}
                mediaSrc={convertedData.media1Src}
                mediaType={convertedData.media1Type}
                modalPopOver={convertedData.media1PopOver}
            />
            <Media
                hasTransparency={convertedData.media2HasTransparency}
                mediaMaxHeight={convertedData.media2MaxHeight}
                mediaPosition={convertedData.media2Position}
                mediaSrc={convertedData.media2Src}
                mediaType={convertedData.media2Type}
                modalPopOver={convertedData.media2PopOver}
            />
        </div>
    );
};

export const TRIPLE_MEDIA_ELEMENT = ({ data }: BlockParams) => {
    const convertedData = data as TRIPLE_MEDIA_TYPE;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8">
            <Media
                hasTransparency={convertedData.media1HasTransparency}
                mediaMaxHeight={convertedData.media1MaxHeight}
                mediaPosition={convertedData.media1Position}
                mediaSrc={convertedData.media1Src}
                mediaType={convertedData.media1Type}
                modalPopOver={convertedData.media1PopOver}
            />
            <Media
                hasTransparency={convertedData.media2HasTransparency}
                mediaMaxHeight={convertedData.media2MaxHeight}
                mediaPosition={convertedData.media2Position}
                mediaSrc={convertedData.media2Src}
                mediaType={convertedData.media2Type}
                modalPopOver={convertedData.media2PopOver}
            />
            <Media
                hasTransparency={convertedData.media3HasTransparency}
                mediaMaxHeight={convertedData.media3MaxHeight}
                mediaPosition={convertedData.media3Position}
                mediaSrc={convertedData.media3Src}
                mediaType={convertedData.media3Type}
                modalPopOver={convertedData.media3PopOver}
            />
        </div>
    );
};

export const SINGLE_TEXT_ELEMENT = ({ data }: BlockParams) => {
    const convertedData = data as SINGLE_TEXT_TYPE;
    return <Text align={convertedData.textAlign} valign={convertedData.textVAlign} text={convertedData.text} title={convertedData.title} />;
};

export const DOUBLE_TEXT_ELEMENT = ({ data }: BlockParams) => {
    const convertedData = data as DOUBLE_TEXT_TYPE;

    return (
        <div className={`gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2`}>
            <Text align={convertedData.textAlign1} valign={convertedData.textVAlign1} text={convertedData.text1} title={convertedData.title1} />
            <Text align={convertedData.textAlign2} valign={convertedData.textVAlign2} text={convertedData.text2} title={convertedData.title2} />
        </div>
    );
};

export const TRIPLE_TEXT_ELEMENT = ({ data }: BlockParams) => {
    const convertedData = data as TRIPLE_TEXT_TYPE;

    return (
        <div className={`gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-3`}>
            <Text align={convertedData.textAlign1} valign={convertedData.textVAlign1} text={convertedData.text1} title={convertedData.title1} />
            <Text align={convertedData.textAlign2} valign={convertedData.textVAlign2} text={convertedData.text2} title={convertedData.title2} />
            <Text align={convertedData.textAlign3} valign={convertedData.textVAlign3} text={convertedData.text3} title={convertedData.title3} />
        </div>
    );
};
