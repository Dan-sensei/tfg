import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconBrandYoutubeFilled, IconPhotoScan } from "@tabler/icons-react";
import clsx from "clsx";
import ImageDrop from "../ImageDrop";
import { Checkbox } from "@nextui-org/checkbox";
import { Slider } from "@nextui-org/slider";
import {
    MAX_IMAGE_BLOCK_HEIGHT,
    MAX_BLOCK_DESCRIPTION_LENGTH,
    MAX_BLOCK_TITLE_LENGTH,
    MAX_BLOCK_IMAGE_SIZE,
    MAX_BLOCK_IMAGE_DIMENSIONS,
} from "@/app/types/defaultData";
import { getYoutubeVideoId, isNullOrEmpty } from "@/app/utils/util";
import { Description, Field, Input, Label, Radio, RadioGroup, Tab, TabGroup, TabList, TabPanel, TabPanels, Textarea } from "@headlessui/react";
import ImageViewer from "../ImageViewer";
import { iFile, localStorageBlob } from "./BlockDefs";
import { CharacterCounter } from "../BasicComponents";
import { HeadlessBasic, HeadlessComplete } from "@/app/lib/headlessUIStyle";
import { BlockMethods } from "./Forms";

export const MediaMissing = (type: string, imagePosition: string) => {
    return (
        <div className={clsx("w-72 aspect-square max-w-full mx-auto rounded-lg border-1 border-white p-1", imagePosition)}>
            <div className="bg-sketch w-full h-full flex items-center justify-center">
                <div className="bg-black/60 backdrop-blur-sm rounded-large p-1">
                    {type === "image" ? (
                        <IconPhotoScan className="stroke-2 " size={45} />
                    ) : (
                        <div className="p-1">
                            <IconBrandYoutubeFilled className="stroke-1 " size={35} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

type MediaFormUpdateProperties<T> = {
    maxHeight: keyof T;
    mediaPosition: keyof T;
    mediaSrc: keyof T;
    hasTransparency: keyof T;
    modalPopOver: keyof T;
    mediaType: keyof T;
};

type MediaFormPartProps<T> = {
    blockMethods: BlockMethods;
    maxHeight: number;
    mediaPosition: string;
    mediaSrc: string;
    hasTransparency: boolean;
    modalPopOver: boolean;
    mediaType: string;
    id: number;
    updateData: (dataToUpdate: Partial<T>) => void;
    updateProperties: MediaFormUpdateProperties<T>;
};

export const MediaFormPart = <T,>({
    blockMethods,
    id,
    mediaPosition,
    mediaSrc,
    mediaType,
    modalPopOver,
    maxHeight,
    hasTransparency,
    updateData,
    updateProperties,
}: MediaFormPartProps<T>) => {
    const tabs = ["image", "video"];
    const imagePositions = [
        { value: "lg:mr-auto lg:ml-0", valueIcon: "mr-auto ml-0" },
        { value: "lg:mx-auto", valueIcon: "mx-auto" },
        { value: "lg:ml-auto lg:mr-0", valueIcon: "ml-auto mr-0" },
    ];
    const defaultImagePosition = imagePositions.find((position) => position.value === mediaPosition) ?? imagePositions[1];

    const isInputDisabled = !isNullOrEmpty(mediaSrc) && !modalPopOver;
    const isImageDropDisabled = !isNullOrEmpty(mediaSrc) && modalPopOver;
    return (
        <section>
            <TabGroup
                defaultIndex={mediaType == "image" ? 0 : 1}
                onChange={(index) => {
                    updateData({ [updateProperties.mediaType]: tabs[index] } as Partial<T>);
                    updateData({ [updateProperties.mediaSrc]: "" } as Partial<T>);
                }}>
                <TabList className="flex gap-2">
                    <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                        Imagen
                    </Tab>
                    <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                        Video
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Field disabled={isInputDisabled} className={"data-[disabled]:opacity-50"}>
                            <div className="mt-3 px-1">Sin compresión</div>
                            <div className="flex items-center bg-white/5 rounded-lg">
                                <div className="px-3 ">
                                    <IconPhotoScan />
                                </div>
                                <Input
                                    defaultValue={mediaType === "image" && modalPopOver ? mediaSrc : ""}
                                    onChange={(e) => {
                                        updateData({ [updateProperties.mediaSrc]: e.target.value } as Partial<T>);
                                        updateData({ [updateProperties.modalPopOver]: !isNullOrEmpty(e.target.value) } as Partial<T>);
                                        blockMethods.validateBlock(id);
                                    }}
                                    className={clsx(
                                        "block w-full rounded-lg border-none bg-white/5  py-1.5 px-3 text-sm/6 text-white",
                                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                    )}
                                    placeholder="https://..."
                                />
                            </div>
                        </Field>
                        <div className="text-center pt-1">o</div>
                        <ImageDrop
                            isDisabled={isImageDropDisabled}
                            id={`block-${id}-${updateProperties.mediaSrc.toString()}`}
                            label=""
                            defaultImage={mediaSrc === localStorageBlob ? null : mediaSrc}
                            maxDimensions={MAX_BLOCK_IMAGE_DIMENSIONS}
                            maxSize={MAX_BLOCK_IMAGE_SIZE}
                            onUpdate={(image: string, blob: Blob | null) => {
                                updateData({ [updateProperties.mediaSrc]: image } as Partial<T>);
                                updateData({ [updateProperties.modalPopOver]: false } as Partial<T>);

                                if (blob) blockMethods.addFileToBlock(id, { id: updateProperties.mediaSrc.toString(), blob: blob });
                                blockMethods.validateBlock(id);
                            }}
                            autocrop={true}
                            onRemove={() => {
                                updateData({ [updateProperties.mediaSrc]: "" } as Partial<T>);
                                blockMethods.removeFileFromBlock(id, updateProperties.mediaSrc.toString());
                            }}
                        />
                        <div className="w-full flex justify-end mt-1">
                            <Checkbox
                                size="sm"
                                className="ml-auto"
                                isSelected={hasTransparency}
                                onValueChange={(e) => {
                                    updateData({ [updateProperties.hasTransparency]: e } as Partial<T>);
                                }}>
                                Tiene transparencia
                            </Checkbox>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <Field className={"data-[disabled]:opacity-50"}>
                            <div className="flex items-center bg-white/5 rounded-lg mt-3">
                                <div className="px-3 ">
                                    <IconBrandYoutubeFilled />
                                </div>
                                <Input
                                    onChange={(e) => {
                                        updateData({ [updateProperties.mediaSrc]: e.target.value } as Partial<T>);
                                        updateData({ [updateProperties.modalPopOver]: false } as Partial<T>);
                                        blockMethods.validateBlock(id);
                                    }}
                                    defaultValue={mediaType === "video" ? mediaSrc : ""}
                                    className={clsx(HeadlessBasic, "rounded-lg")}
                                    placeholder="https://youtu.be/dQw4w9WgXcQ"
                                />
                            </div>
                        </Field>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
            <Slider
                onChange={(e) => {
                    updateData({ [updateProperties.maxHeight]: e } as Partial<T>);
                }}
                label="Altura máxima"
                step={5}
                maxValue={MAX_IMAGE_BLOCK_HEIGHT}
                minValue={100}
                defaultValue={maxHeight}
                className="w-full mt-3"
            />
            <div className="mt-3">Alineación</div>
            <RadioGroup
                defaultValue={defaultImagePosition.value}
                onChange={(e) => {
                    updateData({ [updateProperties.mediaPosition]: e } as Partial<T>);
                }}
                aria-label="Image position"
                className="mt-1 grid grid-cols-3 gap-1">
                {imagePositions.map((position, i) => (
                    <Radio
                        key={i}
                        value={position.value}
                        className="group relative flex cursor-pointer rounded-lg bg-white/5 p-1 text-white shadow-md transition focus:outline-none border-1 border-transparent data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10 data-[checked]:border-white">
                        <div className="flex w-full h-9 items-center justify-between bg-nova-darker rounded-lg p-1">
                            <div className={clsx("aspect-square h-full border-1 p-[2px] rounded-lg ", position.valueIcon)}>
                                <div className="w-full h-full bg-blue-400 rounded-md"></div>
                            </div>
                        </div>
                    </Radio>
                ))}
            </RadioGroup>
        </section>
    );
};

interface MediaDisplayProps {
    mediaMaxHeight: number;
    mediaPosition: string;
    mediaSrc: string;
    hasTransparency: boolean;
    modalPopOver: boolean;
    mediaType: string;
}

export const Media = ({ mediaMaxHeight, mediaPosition, mediaSrc, hasTransparency, modalPopOver, mediaType }: MediaDisplayProps) => {
    let display: JSX.Element = <></>;
    const videoId = getYoutubeVideoId(mediaSrc);

    if (isNullOrEmpty(mediaSrc) || (mediaType === "video" && videoId === null)) {
        display = MediaMissing(mediaType, mediaPosition);
    } else if (mediaType === "image" && modalPopOver) {
        display = <ImageViewer src={mediaSrc} maxHeight={mediaMaxHeight} imagePosition={mediaPosition} alt={""} />;
    } else if (mediaType === "image") {
        display = (
            <img
                src={mediaSrc}
                style={{ maxHeight: `${mediaMaxHeight}px` }}
                className={clsx(mediaPosition, "rounded-lg mx-auto", hasTransparency ? "drop-shadow-light-dark" : "shadow-light-dark")}
                alt=""
            />
        );
    } else {
        display = (
            <iframe
                style={{ maxHeight: `${mediaMaxHeight}px`, maxWidth: `${mediaMaxHeight * (16 / 9)}px` }}
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Gura loses her sanity after dying to the 2nd easiest Dark Souls boss"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className={clsx("w-full aspect-video shadow-light-dark", mediaPosition)}
                allowFullScreen></iframe>
        );
    }
    return <div className={`relative`}>{display}</div>;
};

interface TextProps {
    title: string;
    valign?: string;
    text: string;
    align: string;
}

export const Text = ({ title, valign, text, align }: TextProps) => {
    return (
        <div className={clsx(`text-center whitespace-pre-wrap flex flex-wrap w-full`, valign ?? "", align)}>
            <div className="w-full">
                <h3 className="font-semibold text-lg w-full">{title}</h3>
                <section className="pt-1 w-full">{text}</section>
            </div>
        </div>
    );
};

type VerticalAlignControlsProps<T> = {
    updateData: (dataToUpdate: Partial<T>) => void;
    VAlignProperty: keyof T;
    textVAlign: string;
};
export const TextVerticalAlignControls = <T,>({ updateData, VAlignProperty, textVAlign }: VerticalAlignControlsProps<T>) => {
    const textPositions = [
        { value: "lg:items-start", valueIcon: "items-start" },
        { value: "lg:items-center", valueIcon: "items-center" },
        { value: "lg:items-end", valueIcon: "items-end" },
    ];
    const defaultTextPosition = textPositions.find((position) => position.value === textVAlign) ?? textPositions[0];

    return (
        <RadioGroup
            defaultValue={defaultTextPosition.value}
            onChange={(e) => {
                updateData({ [VAlignProperty]: e } as Partial<T>);
            }}
            aria-label="Image position"
            className="flex flex-col gap-1">
            {textPositions.map((position, i) => (
                <Radio
                    key={i}
                    value={position.value}
                    className="group relative flex cursor-pointer rounded-lg bg-white/5 p-1 text-white shadow-md transition focus:outline-none border-1 border-transparent data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10 data-[checked]:border-white">
                    <div className={clsx("flex w-full h-14 bg-nova-darker rounded-lg p-1", position.valueIcon)}>
                        <div className="flex flex-col gap-1 bg-nova-darker-2 py-1">
                            <div className="w-16 h-1 bg-blue-400 rounded-full"></div>
                            <div className="w-[50%] h-1 bg-blue-400 rounded-full"></div>
                        </div>
                    </div>
                </Radio>
            ))}
        </RadioGroup>
    );
};

type TextFormUpdateProperties<T> = {
    title: keyof T;
    textVAlign?: keyof T;
    textAlign: keyof T;
    text: keyof T;
};
type TextFormPartProps<T> = {
    blockMethods: BlockMethods;
    title: string;
    textVAlign?: string;
    textAlign: string;
    text: string;
    PositionText: string;
    TextName?: string;
    id: number;
    updateData: (dataToUpdate: Partial<T>) => void;
    updateProperties: TextFormUpdateProperties<T>;
};
export const TextFormPart = <T,>({
    blockMethods,
    title,
    textVAlign,
    textAlign,
    text,
    PositionText,
    TextName,
    id,
    updateData,
    updateProperties,
}: TextFormPartProps<T>) => {
    const textAligns = [
        { value: "lg:text-left", valueIcon: "justify-start", icon: <IconAlignLeft size={15} /> },
        { value: "lg:text-center", valueIcon: "justify-center", icon: <IconAlignCenter size={15} /> },
        { value: "lg:text-right", valueIcon: "justify-end", icon: <IconAlignRight size={15} /> },
    ];
    const defaultTextAlign = textAligns.find((position) => position.value === textAlign) ?? textAligns[0];
    return (
        <Field>
            <Label className="text-sm/6 font-medium text-white">Texto {`${TextName ? ` ${TextName}` : ""}`}</Label>
            <Description className="text-xs leading-3  text-white/50">
                Este texto aparecerá a la <span className="font-semibold text-blue-200">{PositionText}</span> del recurso
            </Description>
            <div className="flex mt-2 gap-1">
                <div className="flex-1 flex flex-col gap-1">
                    <Field className={"relative"}>
                        <div className={clsx("absolute h-full flex items-center right-1 pointer-events-none text-right text-tiny px-1")}>
                            <CharacterCounter currentLength={title.length} max={MAX_BLOCK_TITLE_LENGTH} compact />
                        </div>
                        <Input
                            defaultValue={title}
                            onChange={(e) => {
                                updateData({ [updateProperties.title]: e.target.value } as Partial<T>);
                                blockMethods.validateBlock(id);
                            }}
                            invalid={title.length > MAX_BLOCK_TITLE_LENGTH}
                            className={clsx("pr-14 rounded-lg", HeadlessComplete)}
                            placeholder="Título (opcional)"
                        />
                    </Field>
                    <Field className="relative flex-1 flex flex-col">
                        <div className={clsx("absolute top-[5px] right-1 pointer-events-none text-right text-tiny px-1")}>
                            <CharacterCounter currentLength={text.length} max={MAX_BLOCK_DESCRIPTION_LENGTH} compact />
                        </div>
                        <Textarea
                            value={text}
                            onChange={(e) => {
                                updateData({ [updateProperties.text]: e.target.value } as Partial<T>);
                                blockMethods.validateBlock(id);
                            }}
                            invalid={isNullOrEmpty(text) || text.length > MAX_BLOCK_DESCRIPTION_LENGTH}
                            placeholder="Contenido"
                            className={clsx("flex-1 pt-5 resize-none rounded-lg", HeadlessComplete)}
                            rows={5}
                        />
                    </Field>
                </div>
                {textVAlign && updateProperties.textVAlign && (
                    <TextVerticalAlignControls updateData={updateData} VAlignProperty={updateProperties.textVAlign} textVAlign={textVAlign} />
                )}
            </div>
            <RadioGroup
                defaultValue={defaultTextAlign.value}
                onChange={(e) => {
                    updateData({ [updateProperties.textAlign]: e } as Partial<T>);
                }}
                aria-label="Image position"
                className="flex gap-1 pt-1">
                {textAligns.map((position, i) => (
                    <Radio
                        key={i}
                        value={position.value}
                        className={clsx(
                            "group relative flex cursor-pointer rounded-md w-10 bg-white/5 p-1 text-white shadow-md transition focus:outline-none border-1 border-transparent data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10 data-[checked]:border-white",
                            position.valueIcon
                        )}>
                        {position.icon}
                    </Radio>
                ))}
            </RadioGroup>
        </Field>
    );
};
