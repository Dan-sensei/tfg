"use client";

import { Button } from "@nextui-org/button";
import { IconAlignJustified, IconChevronDown, IconPhotoFilled, IconPlus, IconX } from "@tabler/icons-react";
import { useRef } from "react";
import clsx from "clsx";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Field,
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";

import { produce } from "immer";
import { ProjectFormData } from "../types/interfaces";
import { deleteImagesWithPrefix } from "../lib/indexedDBHelper";
import {
    DOUBLE_MEDIA_FORM,
    DOUBLE_TEXT_FORM,
    MEDIA_TEXT_FORM,
    SINGLE_MEDIA_FORM,
    SINGLE_TEXT_FORM,
    TEXT_MEDIA_FORM,
    TRIPLE_MEDIA_FORM,
    TRIPLE_TEXT_FORM,
} from "./TFG_BlockDefinitions/Forms";
import { BLOCKSCHEMA, BLOCKTYPE, BlockInfo, iFile } from "./TFG_BlockDefinitions/BlockDefs";


type Props = {
    className?: string;
    blocks: BlockInfo[];
    updateForm: (data: Partial<ProjectFormData>) => void;
    updateFormBlock: (blockid: number, content: string) => void;
    removeFileFromBlock: (blockid: number, fileIdToRemove: string) => void;
    addFileToBlock: (blockid: number, file: iFile) => void;
    validateBlock: (blockId: number) => void;
};

export const FormTypes = {
    [BLOCKTYPE.MEDIA_TEXT]: {
        form: MEDIA_TEXT_FORM,
        name: "RECURSO - TEXTO",
        description: "Imagen o vídeo con un texto a la derecha",
        icon: (
            <div className="flex justify-around">
                <IconPhotoFilled size={20} />
                <IconAlignJustified size={20} />
            </div>
        ),
    },
    [BLOCKTYPE.TEXT_MEDIA]: {
        form: TEXT_MEDIA_FORM,
        name: "TEXTO - RECURSO",
        description: "Imagen o vídeo con texto a la izquierda",
        icon: (
            <div className="flex justify-around">
                <IconAlignJustified size={20} />
                <IconPhotoFilled size={20} />
            </div>
        ),
    },
    [BLOCKTYPE.SINGLE_MEDIA]: {
        form: SINGLE_MEDIA_FORM,
        name: "RECURSO x1",
        description: "Imagen o vídeo centrado",
        icon: (
            <div className="flex justify-around">
                <IconPhotoFilled size={20} />
            </div>
        ),
    },
    [BLOCKTYPE.DOUBLE_MEDIA]: {
        form: DOUBLE_MEDIA_FORM,
        name: "RECURSO x2",
        description: "2 imágenes o vídeos",
        icon: (
            <div className="flex justify-around">
                <IconPhotoFilled size={20} />
                <IconPhotoFilled size={20} />
            </div>
        ),
    },
    [BLOCKTYPE.TRIPLE_MEDIA]: {
        form: TRIPLE_MEDIA_FORM,
        name: "RECURSO x3",
        description: "3 imágenes o vídeos",
        icon: (
            <div className="flex justify-around">
                <IconPhotoFilled size={20} />
                <IconPhotoFilled size={20} />
                <IconPhotoFilled size={20} />
            </div>
        ),
    },
    [BLOCKTYPE.SINGLE_TEXT]: {
        form: SINGLE_TEXT_FORM,
        name: "UN PÁRRAFO",
        description: "Bloque de texto alineado en el centro",
        icon: (
            <div className="flex justify-around">
                <IconAlignJustified size={20} />
            </div>
        ),
    },
    [BLOCKTYPE.DOUBLE_TEXT]: {
        form: DOUBLE_TEXT_FORM,
        name: "DOS PÁRRAFOS",
        description: "Dos párrafos alineados horizontalmente (verticalmente en móvil)",
        icon: (
            <div className="flex justify-around">
                <IconAlignJustified size={20} />
                <IconAlignJustified size={20} />
            </div>
        ),
    },
    [BLOCKTYPE.TRIPLE_TEXT]: {
        form: TRIPLE_TEXT_FORM,
        name: "TRES PÁRRAFOS",
        description: "Tres párrafos alineados horizontalmente (verticalmente en móvil)",
        icon: (
            <div className="flex justify-around ">
                <IconAlignJustified size={20} />
                <IconAlignJustified size={20} />
                <IconAlignJustified size={20} />
            </div>
        ),
    },
};

export default function BlockBuilder({ className, blocks, updateForm, updateFormBlock, removeFileFromBlock, addFileToBlock, validateBlock }: Props) {
    const idCounterRef = useRef(1);

    const addBlock = () => {
        const newBlocks = produce(blocks, (draft) => {
            let newId: number;
            do {
                newId = idCounterRef.current++;
            } while (Object.values(draft).some((d) => d.id === newId));
            const defaultValues = BLOCKSCHEMA[BLOCKTYPE.MEDIA_TEXT].DEF_VALUES;
            draft.push({ id: newId, type: BLOCKTYPE.MEDIA_TEXT, data: defaultValues, files: [], errors: [] });
            console.log("new block", JSON.parse(defaultValues));
        });
        updateForm({ contentBlocks: newBlocks });
    };

    const removeBlock = (indexToRemove: number) => {
        deleteImagesWithPrefix([`block-${indexToRemove}`, `ublock-${indexToRemove}`]);
        const targetIndex = blocks.findIndex((block) => block.id === indexToRemove);
        if (targetIndex === -1) return;

        const newBlocks = produce(blocks, (draft) => {
            draft.splice(targetIndex, 1);
        });
        updateForm({ contentBlocks: newBlocks });
    };

    const ChangeBlockType = (targetId: number, newTypeId: BLOCKTYPE) => {
        deleteImagesWithPrefix([`block-${targetId}`, `ublock-${targetId}`]);
        const targetIndex = blocks.findIndex((block) => block.id === targetId);
        if (targetIndex === -1) return;

        const newBlocks = produce(blocks, (draft) => {
            draft[targetIndex].type = parseInt(newTypeId.toString());
            draft[targetIndex].data = BLOCKSCHEMA[newTypeId].DEF_VALUES;
            draft[targetIndex].errors = [];
        });
        updateForm({ contentBlocks: newBlocks });
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
                const Form = FormTypes[block.type].form;
                return (
                    <Disclosure
                        as="div"
                        key={block.id}
                        className={clsx(
                            "mt-2 bg-nova-darker border-2 py-1 rounded-lg",
                            block.errors?.length > 0 ? "border-nova-error" : "border-blue-500/50"
                        )}
                        defaultOpen={true}>
                        <div className="px-1 group flex w-full items-center justify-between">
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
                        {block.errors.length > 0 && (
                            <div className="error-message font-semibold px-3 pb-3">
                                {block.errors.map((error, index) => (
                                    <div key={index} className="text-tiny text-nova-error flex items-center">
                                        <IconX size={15} /> {error}
                                    </div>
                                ))}
                            </div>
                        )}
                        <DisclosurePanel
                            transition
                            className="origin-top px-3 pb-3 transition-[transform,opacity] ease-out data-[closed]:-translate-y-[5%] data-[closed]:opacity-0 text-sm/5 text-white/50">
                            <Field className={"pb-3"}>
                                <Label className="text-tiny font-medium text-white">Tipo de bloque</Label>
                                <div className="mx-auto ">
                                    <Listbox value={block.type} onChange={(e) => ChangeBlockType(block.id, e)}>
                                        <ListboxButton
                                            className={clsx(
                                                "relative block w-full rounded-lg bg-white/5 pr-8 text-left text-sm/6 text-white",
                                                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                            )}>
                                            <div className="flex items-center">
                                                <div className="w-20 flex justify-around p-2 bg-nova-darker rounded-l-lg border-1 border-white/10">
                                                    {FormTypes[block.type].icon}
                                                </div>
                                                <div className="flex-1 font-semibold flex items-center pl-2">{FormTypes[block.type].name}</div>
                                            </div>
                                            <IconChevronDown
                                                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                                                aria-hidden="true"
                                            />
                                        </ListboxButton>
                                        <ListboxOptions
                                            anchor="bottom"
                                            transition
                                            className={clsx(
                                                "w-[var(--button-width)] rounded-xl border border-white/5 bg-black/85  backdrop-blur-md p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
                                                "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                                            )}>
                                            {Object.entries(FormTypes).map(([key, value]) => (
                                                <ListboxOption
                                                    key={key}
                                                    value={key}
                                                    className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                    <div className="py-3 px-2 w-20 text-white border-1 rounded-lg border-white/50">{value.icon}</div>
                                                    <div className="text-tiny flex-1">
                                                        <div className=" font-semibold">{value.name}</div>

                                                        <div className="text-tiny text-white/70">{value.description}</div>
                                                    </div>
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </Listbox>
                                </div>
                            </Field>
                            <Form
                                stringifiedData={block.data}
                                id={block.id}
                                removeFileFromBlock={removeFileFromBlock}
                                addFileToBlock={addFileToBlock}
                                updateFormBlock={updateFormBlock}
                                validateBlock={validateBlock}
                            />
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
