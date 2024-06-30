"use client";

import { Button } from "@nextui-org/button";
import {
    IconAlignJustified,
    IconBrandYoutubeFilled,
    IconChevronDown,
    IconCircleCheckFilled,
    IconLink,
    IconPhotoScan,
    IconPlus,
    IconX,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { BLOCKDATA, BLOCKTYPE, BlockInfo, TFG_BLockElement, iFile } from "../lib/BlockTypes";
import clsx from "clsx";
import {
    Description,
    Field,
    Label,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Textarea,
    Input,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    RadioGroup,
    Radio,
} from "@headlessui/react";

import { Checkbox } from "@nextui-org/checkbox";
import ImageDrop from "./ImageDrop";
import { produce } from "immer";
import { ProjectFormData } from "../types/interfaces";
import { deleteImagesWithPrefix } from "../lib/indexedDBHelper";
import { MEDIATXT_SLOTS } from "./TFG_BlockDefinitions/MEDIA_TEXT";
import { MAX_IMAGE_BLOCK_HEIGHT } from "../types/defaultData";
import { Slider } from "@nextui-org/slider";
import { Divider } from "@nextui-org/divider";
import { isNullOrEmpty } from "../utils/util";
type PropsToBlocks = {
    id: number;
    removeFile: (blockid: number, fileIdToRemove: number, imageSrcSlot: number) => void;
    updateBlock: (blockid: number, slotIndex: number, content: string, file: iFile | null) => void;
    values: string[];
};

const IMAGE_TEXT_FORM = ({ id, removeFile, updateBlock, values }: PropsToBlocks) => {
    const tabs = ["image", "video"];
    const imagePositions = ["lg:mr-auto lg:ml-0", "lg:mx-auto", "lg:ml-auto lg:mr-0"];
    const defaultImagePosition = imagePositions.find((position) => position === values[MEDIATXT_SLOTS.MEDIA_POSITION]) ?? imagePositions[1];
    const textPositions = ["lg:items-start", "lg:items-center", "lg:items-end"];
    const defaultTextPosition = imagePositions.find((position) => position === values[MEDIATXT_SLOTS.TEXT_POSITION]) ?? textPositions[0];

    const isInputDisabled = isNullOrEmpty(values[MEDIATXT_SLOTS.IMG_SRC_LINK]) && !isNullOrEmpty(values[MEDIATXT_SLOTS.MEDIA_SRC]);
    const isImageDropDisabled = !isNullOrEmpty(values[MEDIATXT_SLOTS.IMG_SRC_LINK]) && !isNullOrEmpty(values[MEDIATXT_SLOTS.MEDIA_SRC]);
    return (
        <div className={`min-h-[30px] flex flex-col pt-2`}>
            <TabGroup
                defaultIndex={values[MEDIATXT_SLOTS.MEDIA_TYPE] == "image" ? 0 : 1}
                onChange={(index) => {
                    updateBlock(id, MEDIATXT_SLOTS.MEDIA_TYPE, tabs[index], null);
                    const src = index === 0 ? values[MEDIATXT_SLOTS.IMG_SRC_LINK] : values[MEDIATXT_SLOTS.VID_SRC_LINK];
                    updateBlock(id, MEDIATXT_SLOTS.MEDIA_SRC, src, null);
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
                                    defaultValue={values[MEDIATXT_SLOTS.IMG_SRC_LINK]}
                                    onChange={(e) => {
                                        updateBlock(id, MEDIATXT_SLOTS.MEDIA_SRC, e.target.value, null);
                                        updateBlock(id, MEDIATXT_SLOTS.IMG_SRC_LINK, e.target.value, null);
                                        updateBlock(id, MEDIATXT_SLOTS.IMG_MODAL_CLICK, "true", null);
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
                            id={`block-${id}`}
                            label=""
                            maxDimensions={{ width: 800, height: MAX_IMAGE_BLOCK_HEIGHT }}
                            maxSize={3 * 1024 * 1024}
                            onUpdate={(image: string, file: File | null) => {
                                const imageFile = file ? { id: 0, file: file } : null;
                                updateBlock(id, MEDIATXT_SLOTS.MEDIA_SRC, image, imageFile);
                                updateBlock(id, MEDIATXT_SLOTS.IMG_SRC_LINK, "", null);
                                updateBlock(id, MEDIATXT_SLOTS.IMG_MODAL_CLICK, "", null);
                            }}
                            autocrop={true}
                            onRemove={() => {
                                removeFile(id, 0, MEDIATXT_SLOTS.MEDIA_SRC);
                            }}
                        />
                        <div className="w-full flex justify-end mt-1">
                            <Checkbox
                                size="sm"
                                className="ml-auto"
                                isSelected={values[MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY] === "true"}
                                onValueChange={(e) => {
                                    updateBlock(id, MEDIATXT_SLOTS.IMG_HAS_TRANSPARENCY, e.toString(), null);
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
                                        updateBlock(id, MEDIATXT_SLOTS.MEDIA_SRC, e.target.value, null);
                                        updateBlock(id, MEDIATXT_SLOTS.VID_SRC_LINK, e.target.value, null);
                                        updateBlock(id, MEDIATXT_SLOTS.IMG_MODAL_CLICK, "", null);
                                    }}
                                    defaultValue={values[MEDIATXT_SLOTS.VID_SRC_LINK]}
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
            <Divider className="mb-5 mt-3" />
            <Slider
                onChange={(e) => {
                    updateBlock(id, MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT, e.toString(), null);
                }}
                label="Altura máxima de la imagen"
                step={5}
                maxValue={MAX_IMAGE_BLOCK_HEIGHT}
                minValue={100}
                defaultValue={parseInt(values[MEDIATXT_SLOTS.MEDIA_MAX_HEIGHT])}
                className="w-full"
            />
            <div className="mt-3">Alineación de la imagen</div>
            <RadioGroup
                defaultValue={defaultImagePosition}
                onChange={(e) => {
                    updateBlock(id, MEDIATXT_SLOTS.MEDIA_POSITION, e, null);
                }}
                aria-label="Image position"
                className="mt-1 grid grid-cols-3 gap-1">
                {imagePositions.map((position, i) => (
                    <Radio
                        key={i}
                        value={position}
                        className="group relative flex cursor-pointer rounded-lg bg-white/5 p-1 text-white shadow-md transition focus:outline-none border-1 border-transparent data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10 data-[checked]:border-white">
                        <div className="flex w-full h-9 items-center justify-between bg-nova-darker rounded-lg p-1">
                            <div className={clsx("aspect-square h-full border-1 p-[2px] rounded-lg ", position)}>
                                <div className="w-full h-full bg-blue-400 rounded-md"></div>
                            </div>
                        </div>
                    </Radio>
                ))}
            </RadioGroup>
            <Field className="mt-3">
                <Label className="text-sm/6 font-medium text-white">Texto</Label>
                <Description className="text-sm/6 leading-3  text-white/50">
                    Este texto aparecerá a la <span className="font-semibold text-blue-200">derecha</span> del recurso
                </Description>
                <div className="flex mt-2 gap-1">
                    <Textarea
                        value={values[MEDIATXT_SLOTS.TEXT]}
                        onChange={(e) => {
                            updateBlock(id, MEDIATXT_SLOTS.TEXT, e.target.value, null);
                        }}
                        className={clsx(
                            "block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                        )}
                        rows={5}
                    />
                    <div>
                        <RadioGroup
                            defaultValue={defaultTextPosition}
                            onChange={(e) => {
                                updateBlock(id, MEDIATXT_SLOTS.TEXT_POSITION, e, null);
                            }}
                            aria-label="Image position"
                            className="flex flex-col gap-1">
                            {textPositions.map((position, i) => (
                                <Radio
                                    key={i}
                                    value={position}
                                    className="group relative flex cursor-pointer rounded-lg bg-white/5 p-1 text-white shadow-md transition focus:outline-none border-1 border-transparent data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10 data-[checked]:border-white">
                                    <div className={clsx("flex w-full h-14 bg-nova-darker rounded-lg p-1", position)}>
                                        <div className="flex flex-col gap-1 bg-nova-darker-2 py-1">
                                            <div className="w-16 h-1 bg-blue-400 rounded-full"></div>
                                            <div className="w-[50%] h-1 bg-blue-400 rounded-full"></div>
                                        </div>
                                    </div>
                                </Radio>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            </Field>
        </div>
    );
};
const TEXT_IMAGE_FORM = () => {
    return <div className="min-h-[30px] gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2"></div>;
};
const SINGLE_IMAGE_FORM = () => {
    return <div className="relative min-h-[30px]"></div>;
};

const DOUBLE_IMAGE_FORM = () => {
    return <div className="min-h-[30px] gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2"></div>;
};

const TRIPLE_IMAGE_FORM = () => {
    return <div className="min-h-[30px] grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8"></div>;
};
const SINGLE_TEXT_FORM = () => {
    return <div className="flex gap-3 xl:gap-8 min-h-[30px] text-justify"></div>;
};

const DOUBLE_TEXT_FORM = () => {
    return <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8 min-h-[30px] text-justify"></div>;
};

const TRIPLE_TEXT_FORM = () => {
    return <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8 min-h-[30px] text-justify"></div>;
};

type Props = {
    className?: string;
    blocks: BlockInfo[];
    updateForm: (data: Partial<ProjectFormData>) => void;
    updateFormBlock: (blockid: number, slotIndex: number, content: string, file: iFile | null) => void;
    removeFileFromBlock: (blockid: number, fileIdToRemove: number, imageSrcSlot: number) => void;
};

export const FormTypes = {
    [BLOCKTYPE.MEDIA_TEXT]: IMAGE_TEXT_FORM,
    [BLOCKTYPE.TEXT_MEDIA]: TEXT_IMAGE_FORM,
    [BLOCKTYPE.SINGLE_MEDIA]: SINGLE_IMAGE_FORM,
    [BLOCKTYPE.DOUBLE_MEDIA]: DOUBLE_IMAGE_FORM,
    [BLOCKTYPE.TRIPLE_MEDIA]: TRIPLE_IMAGE_FORM,
    [BLOCKTYPE.TRIPLE_TEXT]: TRIPLE_TEXT_FORM,
    [BLOCKTYPE.DOUBLE_TEXT]: DOUBLE_TEXT_FORM,
    [BLOCKTYPE.SINGLE_TEXT]: SINGLE_TEXT_FORM,
};

export default function BlockBuilder({ className, blocks, updateForm, updateFormBlock, removeFileFromBlock }: Props) {
    const idCounterRef = useRef(1);

    const addBlock = () => {
        const newBlocks = produce(blocks, (draft) => {
            let newId: number;
            do {
                newId = idCounterRef.current++;
            } while (Object.values(draft).some((d) => d.id === newId));

            const DefValuesObject = BLOCKDATA[BLOCKTYPE.MEDIA_TEXT].DEF_VALUES;
            const maxIndex = Math.max(...Object.keys(DefValuesObject).map(Number));
            const defaultValues = Array.from({ length: maxIndex + 1 }, (_, index) =>
                DefValuesObject[index] !== undefined ? DefValuesObject[index] : ""
            );
            draft.push({ id: newId, type: BLOCKTYPE.MEDIA_TEXT, content: defaultValues, files: [] });
        });
        updateForm({ content: newBlocks });
    };

    const removeBlock = (indexToRemove: number) => {
        deleteImagesWithPrefix([`block-${indexToRemove}`, `ublock-${indexToRemove}`]);
        const targetIndex = blocks.findIndex((block) => block.id === indexToRemove);
        if (targetIndex === -1) return;

        const newBlocks = produce(blocks, (draft) => {
            draft.splice(targetIndex, 1);
        });
        updateForm({ content: newBlocks });
    };
    return (
        <div className={clsx(className)}>
            <div className="text-sm">
                Contenido{" "}
                <span className="text-tiny text-white/70">
                    <span className=" tracking-wider">({Object.keys(blocks).length}/5</span> bloques)
                </span>
            </div>
            {blocks.map((block, index) => {
                const Form = FormTypes[block.type];
                return (
                    <Disclosure
                        as="div"
                        key={block.id}
                        className="mt-2 bg-nova-darker border-2 border-blue-500/50 py-1 rounded-lg"
                        defaultOpen={true}>
                        <div className="px-1  group flex w-full items-center justify-between">
                            <DisclosureButton className="flex justify-between flex-1 items-center px-2 py-1 hover:bg-blue-400/20 transition-colors rounded-lg ">
                                <span className="text-sm/6 font-medium text-white group-data-[hover]:text-white/80">
                                    <span className="text-tiny text-gray-300 font-semibold">
                                        Bloque <span className="text-blue-400">#{index + 1}</span>
                                    </span>
                                </span>
                                <IconChevronDown className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                            </DisclosureButton>
                            <Button
                                isIconOnly
                                aria-label="Close"
                                className="rounded-full z-50 p-0 w-7 h-7 min-w-0 pr-[1px] pt-[1px]"
                                variant="light"
                                onClick={() => removeBlock(block.id)}>
                                <IconX size={15} />
                            </Button>
                        </div>
                        <DisclosurePanel
                            transition
                            className="origin-top px-3 pb-3 transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 mt-2 text-sm/5 text-white/50">
                            <Form values={block.content} id={block.id} removeFile={removeFileFromBlock} updateBlock={updateFormBlock} />
                        </DisclosurePanel>
                    </Disclosure>
                );
            })}
            {Object.keys(blocks).length < 5 && (
                <Button onClick={addBlock} className="mt-4 h-32 border-1 rounded-lg justify-center flex bg-nova-darker border-blue-500  w-full">
                    <div className="rounded-full border-2 p-2 border-dashed border-blue-400 ">
                        <IconPlus size={40} />
                    </div>
                </Button>
            )}
        </div>
    );
}
