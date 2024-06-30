import { getYoutubeVideoId, isNullOrEmpty } from "@/app/utils/util";
import { IconBrandYoutubeFilled, IconPhotoScan } from "@tabler/icons-react";
import clsx from "clsx";
import ImageViewer from "../ImageViewer";

export enum MEDIATXT_SLOTS {
    /* REQUIRED PARAMS */
    MEDIA_MAX_HEIGHT = 0,
    MEDIA_POSITION,
    MEDIA_TYPE,
    MEDIA_SRC,
    IMG_MODAL_CLICK,
    IMG_HAS_TRANSPARENCY,
    TEXT_POSITION,
    TEXT,
    __LENGTH,
    /* FORM PARAMS */
    IMG_SRC_LINK,
    VID_SRC_LINK,
}

export const MediaMissing = (icon: JSX.Element, imagePosition: string) => {
    return (
        <div className={clsx("size-72  rounded-lg border-1 border-white p-1", imagePosition)}>
            <div className="bg-sketch w-full h-full flex items-center justify-center">
                <div className="bg-black/60 backdrop-blur-sm rounded-large p-1">{icon}</div>
            </div>
        </div>
    );
};

export const MEDIA_TEXT = ({ content }: { content: string[] }) => {
    const maxHeight = content[MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT];
    const imagePosition = content[MEDIATXT_SLOTS.MEDIA_POSITION];
    const imageLink = content[MEDIATXT_SLOTS.MEDIA_SRC];
    const textPosition = content[MEDIATXT_SLOTS.TEXT_POSITION];
    const hasTransparency = content[MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY] === "true";
    const modalImage = content[MEDIATXT_SLOTS.IMG_MODAL_CLICK];
    const text = content[MEDIATXT_SLOTS.TEXT];
    const type = content[MEDIATXT_SLOTS.MEDIA_TYPE];
    let display: JSX.Element = <></>;
    const videoId = getYoutubeVideoId(imageLink);

    if (isNullOrEmpty(imageLink) || (type === "video" && videoId === null)) {
        display = MediaMissing(
            type === "image" ? (
                <IconPhotoScan className="stroke-2 " size={45} />
            ) : (
                <div className="p-1">
                    <IconBrandYoutubeFilled className="stroke-1 " size={35} />
                </div>
            ),
            imagePosition
        );
    } else if (type === "image" && modalImage === "true") {
        display = <ImageViewer src={imageLink} maxHeight={maxHeight} imagePosition={imagePosition} alt={""} />
    }
    else if(type === "image"){
        display = <img src={imageLink} style={{ maxHeight: `${maxHeight}px` }} className={clsx(imagePosition, "rounded-lg mx-auto", hasTransparency ? "drop-shadow-light-dark":"shadow-light-dark")} alt="" />;
    } 
    else {
        display = (
            <iframe
                style={{ maxHeight: `${maxHeight}px` }}
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(imageLink)}`}
                title="Gura loses her sanity after dying to the 2nd easiest Dark Souls boss"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full aspect-video"
                allowFullScreen></iframe>
        );
    }

    return (
        <div className={`gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2`}>
            <div className={`relative`}>{display}</div>
            <div className={`flex-1 flex ${textPosition} text-center lg:text-left whitespace-pre-wrap`}>{text}</div>
        </div>
    );
};

export const TEXT_MEDIA = ({ content }: { content: string[] }) => {
    const maxHeight = content[MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT];
    const imagePosition = content[MEDIATXT_SLOTS.MEDIA_POSITION];
    const imageLink = content[MEDIATXT_SLOTS.MEDIA_SRC];
    const text = content[MEDIATXT_SLOTS.TEXT];
    const type = content[MEDIATXT_SLOTS.MEDIA_TYPE];
    return (
        <div className="min-h-[30px] gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2">
            <div className="flex-1 items-start whitespace-pre-wrap">{text}</div>
            <div className="relative">
                <img
                    src={imageLink}
                    style={{ maxHeight: `${maxHeight}px` }}
                    className={`${imagePosition} ml-auto rounded-lg shadow-light-dark`}
                    alt=""
                />
            </div>
        </div>
    );
};
