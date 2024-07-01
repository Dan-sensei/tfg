import { IconAlignCenter, IconAlignLeft, IconAlignRight, IconBrandYoutubeFilled, IconPhotoScan } from "@tabler/icons-react";
import clsx from "clsx";
import ImageDrop from "../ImageDrop";
import { Checkbox } from "@nextui-org/checkbox";
import { Slider } from "@nextui-org/slider";
import { MAX_IMAGE_BLOCK_WIDTH, MAX_IMAGE_BLOCK_HEIGHT } from "@/app/types/defaultData";
import { getYoutubeVideoId, isNullOrEmpty } from "@/app/utils/util";
import { Description, Field, Input, Label, Radio, RadioGroup, Tab, TabGroup, TabList, TabPanel, TabPanels, Textarea } from "@headlessui/react";
import ImageViewer from "../ImageViewer";
import { iFile } from "./BlockDefs";

export type PropsToBlocks = {
    id: number;
    removeFile: (blockid: number, fileIdToRemove: number, imageSrcSlot: number) => void;
    updateBlock: (blockid: number, slotIndex: number, content: string, file: iFile | null) => void;
    values: string[];
};

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

type MediaFormPartProps = {
    blockProps: PropsToBlocks;
    MEDIA_POSITION: number;
    IMG_SRC_LINK: number;
    MEDIA_SRC: number;
    MEDIA_TYPE: number;
    VID_SRC_LINK: number;
    IMG_MODAL_CLICK: number;
    MEDIA_MAX_HEIGHT: number;
    IMG_HAS_TRANSPARENCY: number;
    IMAGE_DROP_INDEX: number;
};

export const MediaFormPart = ({
    blockProps: { id, updateBlock, removeFile, values },
    MEDIA_POSITION,
    IMG_SRC_LINK,
    MEDIA_SRC,
    MEDIA_TYPE,
    VID_SRC_LINK,
    IMG_MODAL_CLICK,
    MEDIA_MAX_HEIGHT,
    IMG_HAS_TRANSPARENCY,
    IMAGE_DROP_INDEX,
}: MediaFormPartProps) => {
    const tabs = ["image", "video"];
    const imagePositions = [
        { value: "lg:mr-auto lg:ml-0", valueIcon: "mr-auto ml-0" },
        { value: "lg:mx-auto", valueIcon: "mx-auto" },
        { value: "lg:ml-auto lg:mr-0", valueIcon: "ml-auto mr-0" },
    ];
    const defaultImagePosition = imagePositions.find((position) => position.value === values[MEDIA_POSITION]) ?? imagePositions[1];

    const isInputDisabled = isNullOrEmpty(values[IMG_SRC_LINK]) && !isNullOrEmpty(values[MEDIA_SRC]);
    const isImageDropDisabled = !isNullOrEmpty(values[IMG_SRC_LINK]) && !isNullOrEmpty(values[MEDIA_SRC]);
    return (
        <section>
            <TabGroup
                defaultIndex={values[MEDIA_TYPE] == "image" ? 0 : 1}
                onChange={(index) => {
                    updateBlock(id, MEDIA_TYPE, tabs[index], null);
                    const src = index === 0 ? values[IMG_SRC_LINK] : values[VID_SRC_LINK];
                    updateBlock(id, MEDIA_SRC, src, null);
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
                                    defaultValue={values[IMG_SRC_LINK]}
                                    onChange={(e) => {
                                        updateBlock(id, MEDIA_SRC, e.target.value, null);
                                        updateBlock(id, IMG_SRC_LINK, e.target.value, null);
                                        updateBlock(id, IMG_MODAL_CLICK, "true", null);
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
                            id={`block-${id}-${IMAGE_DROP_INDEX}`}
                            label=""
                            maxDimensions={{ width: MAX_IMAGE_BLOCK_WIDTH, height: MAX_IMAGE_BLOCK_HEIGHT }}
                            maxSize={3 * 1024 * 1024}
                            onUpdate={(image: string, file: File | null) => {
                                const imageFile = file ? { id: IMAGE_DROP_INDEX, file: file } : null;
                                updateBlock(id, MEDIA_SRC, image, imageFile);
                                updateBlock(id, IMG_SRC_LINK, "", null);
                                updateBlock(id, IMG_MODAL_CLICK, "", null);
                            }}
                            autocrop={true}
                            onRemove={() => {
                                removeFile(id, IMAGE_DROP_INDEX, MEDIA_SRC);
                            }}
                        />
                        <div className="w-full flex justify-end mt-1">
                            <Checkbox
                                size="sm"
                                className="ml-auto"
                                isSelected={values[IMG_HAS_TRANSPARENCY] === "true"}
                                onValueChange={(e) => {
                                    updateBlock(id, IMG_HAS_TRANSPARENCY, e.toString(), null);
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
                                        updateBlock(id, MEDIA_SRC, e.target.value, null);
                                        updateBlock(id, VID_SRC_LINK, e.target.value, null);
                                        updateBlock(id, IMG_MODAL_CLICK, "", null);
                                    }}
                                    defaultValue={values[VID_SRC_LINK]}
                                    className={clsx(
                                        "block w-full rounded-lg border-none bg-white/5  py-1.5 px-3 text-sm/6 text-white",
                                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                    )}
                                    placeholder="https://youtu.be/dQw4w9WgXcQ"
                                />
                            </div>
                        </Field>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
            <Slider
                onChange={(e) => {
                    updateBlock(id, MEDIA_MAX_HEIGHT, e.toString(), null);
                }}
                label="Altura máxima de la imagen"
                step={5}
                maxValue={MAX_IMAGE_BLOCK_HEIGHT}
                minValue={100}
                defaultValue={parseInt(values[MEDIA_MAX_HEIGHT])}
                className="w-full mt-3"
            />
            <div className="mt-3">Alineación de la imagen</div>
            <RadioGroup
                defaultValue={defaultImagePosition.value}
                onChange={(e) => {
                    updateBlock(id, MEDIA_POSITION, e, null);
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
    content: string[];
    MEDIA_MAX_HEIGHT: number;
    MEDIA_POSITION: number;
    MEDIA_SRC: number;
    IMG_HAS_TRANSPARENCY: number;
    IMG_MODAL_CLICK: number;
    MEDIA_TYPE: number;
}

export const Media = ({
    content,
    MEDIA_MAX_HEIGHT,
    MEDIA_POSITION,
    MEDIA_SRC,
    IMG_HAS_TRANSPARENCY,
    IMG_MODAL_CLICK,
    MEDIA_TYPE,
}: MediaDisplayProps) => {
    const maxHeight = parseInt(content[MEDIA_MAX_HEIGHT]);
    const imagePosition = content[MEDIA_POSITION];
    const imageLink = content[MEDIA_SRC];
    const hasTransparency = content[IMG_HAS_TRANSPARENCY] === "true";
    const modalImage = content[IMG_MODAL_CLICK];

    const type = content[MEDIA_TYPE];
    let display: JSX.Element = <></>;
    const videoId = getYoutubeVideoId(imageLink);

    if (isNullOrEmpty(imageLink) || (type === "video" && videoId === null)) {
        display = MediaMissing(type, imagePosition);
    } else if (type === "image" && modalImage === "true") {
        display = <ImageViewer src={imageLink} maxHeight={maxHeight} imagePosition={imagePosition} alt={""} />;
    } else if (type === "image") {
        display = (
            <img
                src={imageLink}
                style={{ maxHeight: `${maxHeight}px` }}
                className={clsx(imagePosition, "rounded-lg mx-auto", hasTransparency ? "drop-shadow-light-dark" : "shadow-light-dark")}
                alt=""
            />
        );
    } else {
        display = (
            <iframe
                style={{ maxHeight: `${maxHeight}px`, maxWidth: `${maxHeight * (16 / 9)}px` }}
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(imageLink)}`}
                title="Gura loses her sanity after dying to the 2nd easiest Dark Souls boss"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className={clsx("w-full aspect-video shadow-light-dark", imagePosition)}
                allowFullScreen></iframe>
        );
    }
    return <div className={`relative`}>{display}</div>;
};

interface TextProps {
    content: string[];
    TEXT_TITLE: number;
    TEXT_POSITION?: number;
    TEXT: number;
    TEXT_ALIGN: number;
}

export const Text = ({ content, TEXT_TITLE, TEXT_POSITION, TEXT, TEXT_ALIGN }: TextProps) => {
    const text = content[TEXT];
    const textAlign = content[TEXT_ALIGN];
    const title = content[TEXT_TITLE];

    return (
        <div className={clsx(`text-center whitespace-pre-wrap w-full`, TEXT_POSITION ? content[TEXT_POSITION] : "", textAlign)}>
            <h3 className="font-semibold text-lg">{title}</h3>
            <section className="pt-1">{text}</section>
        </div>
    );
};

type VerticalAlignControlsProps = {
    blockProps: PropsToBlocks;
    TEXT_POSITION: number;
};
export const TextVerticalAlignControls = ({ blockProps: { id, updateBlock, values }, TEXT_POSITION }: VerticalAlignControlsProps) => {
    const textPositions = [
        { value: "lg:items-start", valueIcon: "items-start" },
        { value: "lg:items-center", valueIcon: "items-center" },
        { value: "lg:items-end", valueIcon: "items-end" },
    ];
    const defaultTextPosition = textPositions.find((position) => position.value === values[TEXT_POSITION]) ?? textPositions[0];

    return (
        <RadioGroup
            defaultValue={defaultTextPosition.value}
            onChange={(e) => {
                updateBlock(id, TEXT_POSITION, e, null);
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

type TextFormPartProps = {
    blockProps: PropsToBlocks;
    TEXT_TITLE: number;
    TEXT_POSITION?: number;
    TEXT_ALIGN: number;
    TEXT: number;
    PositionText: string;
    TextName?: string;
};
export const TextFormPart = ({
    blockProps: { id, removeFile, updateBlock, values },
    TEXT_TITLE,
    TEXT_POSITION,
    TEXT_ALIGN,
    TEXT,
    PositionText,
    TextName,
}: TextFormPartProps) => {
    const textAligns = [
        { value: "lg:text-left", valueIcon: "justify-start", icon: <IconAlignLeft size={15} /> },
        { value: "lg:text-center", valueIcon: "justify-center", icon: <IconAlignCenter size={15} /> },
        { value: "lg:text-right", valueIcon: "justify-end", icon: <IconAlignRight size={15} /> },
    ];
    const defaultTextAlign = textAligns.find((position) => position.value === values[TEXT_ALIGN]) ?? textAligns[0];
    return (
        <Field>
            <Label className="text-sm/6 font-medium text-white">Texto {`${TextName ? ` ${TextName}` : ""}`}</Label>
            <Description className="text-xs leading-3  text-white/50">
                Este texto aparecerá a la <span className="font-semibold text-blue-200">{PositionText}</span> del recurso
            </Description>
            <div className="flex mt-2 gap-1">
                <div className="flex-1 flex flex-col gap-1">
                    <Input
                        defaultValue={values[TEXT_TITLE]}
                        onChange={(e) => {
                            updateBlock(id, TEXT_TITLE, e.target.value, null);
                        }}
                        className={clsx(
                            "block w-full rounded-lg border-none bg-white/5  py-1.5 px-3 text-sm/6 text-white",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                        )}
                        placeholder="Título (opcional)"
                    />
                    <Textarea
                        value={values[TEXT]}
                        onChange={(e) => {
                            updateBlock(id, TEXT, e.target.value, null);
                        }}
                        placeholder="Contenido"
                        className={clsx(
                            "flex-1 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                        )}
                        rows={5}
                    />
                </div>
                {TEXT_POSITION && <TextVerticalAlignControls blockProps={{ id, removeFile, updateBlock, values }} TEXT_POSITION={TEXT_POSITION} />}
            </div>
            <RadioGroup
                defaultValue={defaultTextAlign.value}
                onChange={(e) => {
                    updateBlock(id, TEXT_ALIGN, e, null);
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
