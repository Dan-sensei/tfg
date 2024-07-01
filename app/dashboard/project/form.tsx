"use client";

import { MessageError, ProjectFormData, college, department, iFullTFG, user } from "@/app/types/interfaces";
import { isNullOrEmpty, toFirstLetterUppercase } from "@/app/utils/util";
import { useEffect, useState } from "react";
import { Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import TFG_Details from "@/app/components/TFG/TFG_Details";
import { IconCheck, IconChevronDown, IconEye, IconEyeX, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import ImageDrop from "@/app/components/ImageDrop";
import { Spinner } from "@nextui-org/spinner";
import { DEF_BANNER } from "@/app/types/defaultData";
import { deleteNonExistentImagesFromIndexedDB } from "@/app/lib/indexedDBHelper";
import { Divider } from "@nextui-org/divider";
import BlockBuilder from "@/app/components/BlockBuilder";
import { Button, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from "@headlessui/react";
import { Button as NextUIButton } from "@nextui-org/button";
import { produce } from "immer";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { BLOCKDATA, BlockInfo, iFile } from "@/app/components/TFG_BlockDefinitions/BlockDefs";
const defaultErrorMessages = {
    thumbnail: "",
    banner: "",
    title: "El título no puede estar vacío ni ocupar más de 80 carácteres",
    description: "La descripción no puede estar vacía ni ocupar más de 500 carácteres",
    content: "",
    documentLink: "Debes incluir un enlace a la memoria de tu TFG",
    tags: "Por favor añade al menos una tag",
};

type Props = {
    college: college;
    departments: department[];
    teachers: user[];
};

export default function ProjectForm({ college, departments, teachers }: Props) {
    const [isMounted, setIsMounted] = useState(false);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [form, setForm] = useState<ProjectFormData>({
        thumbnail: "",
        banner: DEF_BANNER,
        title: "",
        description: "",
        departmentId: departments.length > 0 ? departments[0].id : undefined,
        departmentName: departments.length > 0 ? departments[0].name : undefined,
        departmentlink: departments.length > 0 ? departments[0].link : undefined,
        tutor: [],
        content: [],
        documentLink: "link",
        tags: [],
    });
    const [errorMessages, setErrorMessages] = useState<MessageError>({
        thumbnail: "",
        banner: "",
        title: "",
        description: "",
        departmentName: "",
        departmentlink: "",
        content: "",
        documentLink: "",
        tags: "",
    });

    const simplifiedBlocks = Object.values(form.content).map((block) => ({
        type: block.type,
        content: block.content,
    }));

    const TFG: iFullTFG = {
        ...form,
        id: 0,
        author: [],
        tutor: form.tutor,
        department: {
            id: form.departmentId ?? 0,
            name: form.departmentName ?? "",
            link: form.departmentlink ?? "",
        },
        pages: 0,
        documentLink: "link",
        views: 0,
        score: 0,
        createdAt: new Date(),
        content: JSON.stringify(simplifiedBlocks),
        college: {
            id: college.id,
            name: college.name,
            image: college.image,
        },
    };

    useEffect(() => {
        const tfgSavedData = localStorage.getItem("tfg-data");

        const existingImages: string[] = [];
        if (tfgSavedData) {
            try {
                const data = JSON.parse(tfgSavedData) as ProjectFormData;

                setForm((current) => ({
                    ...current,
                    title: data.title ?? "",
                    banner: DEF_BANNER,
                    description: data.description ?? "",
                    departmentId: data.departmentId && 1,
                    departmentName: data.departmentName ?? "",
                    departmentlink: data.departmentlink ?? "",
                    tutor: data.tutor ?? [],
                    content: data.content ?? "",
                    documentLink: data.documentLink ?? "",
                    tags: data.tags ?? [],
                }));

                if (data.banner) {
                    existingImages.push("banner");
                    existingImages.push("ubanner");
                }
                if (data.thumbnail) {
                    existingImages.push("thumbnail");
                    existingImages.push("uthumbnail");
                }
                Object.values(data.content).forEach((c) => {
                    existingImages.push(`block-${c.id}`);
                    existingImages.push(`ublock-${c.id}`);
                });
            } catch (e) {
                localStorage.removeItem("tfg-data");
            }
        }
        deleteNonExistentImagesFromIndexedDB(existingImages);
        setIsMounted(true);
    }, []);

    const handleSubmit = () => {
        if (!bannerFile) return;
        const formData = new FormData();
        formData.append("banner", bannerFile);

        fetch("/api/save-tfg", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
            })
            .catch((e) => console.error(e));
    };
    const [query, setQuery] = useState("");
    const filteredPeople =
        query === ""
            ? teachers
            : teachers.filter((teacher) => {
                  return teacher.name.toLowerCase().includes(query.toLowerCase());
              });

    const updateForm = (data: Partial<ProjectFormData>) => {
        setForm(
            produce((draft) => {
                Object.assign(draft, data);
                saveToLocalStorage(draft);
            })
        );
    };

    const updateFormBlock = (blockid: number, slotIndex: number, content: string, file: iFile | null) => {
        setForm(
            produce((draft) => {
                const target = draft.content.find((contentBlock) => contentBlock.id === blockid);
                if (target) {
                    target.content[slotIndex] = content;

                    if (file) {
                        const targetFile = target.files.findIndex((f) => f.id === file.id);
                        if (targetFile > -1) target.files[targetFile] = file;
                        else target.files.push(file);
                    }
                }
                saveToLocalStorage(draft);
            })
        );
    };

    const removeFileFromBlock = (blockid: number, fileIdToRemove: number, imageSrcSlot: number) => {
        setForm(
            produce((draft) => {
                const target = draft.content.find((contentBlock) => contentBlock.id === blockid);
                if (target) {
                    target.content[imageSrcSlot] = "";
                    target.files = target.files.filter((file) => file.id !== fileIdToRemove);
                }
                saveToLocalStorage(draft);
            })
        );
    };

    const saveToLocalStorage = (data: ProjectFormData) => {
        const saveBlocksData: BlockInfo[] = data.content.map((block) => {
            const blockData = BLOCKDATA[block.type];
            const content = block.content.map((c, i) => {
                const skipRule = blockData.SKIP_LOCAL_SAVE_UNLESS.find((rule) => rule.skip === i);
                if (skipRule) {
                    const shouldKeep = skipRule.unless(block.content);
                    if (!shouldKeep) {
                        return "";
                    }
                }
                return c;
            });

            return {
                id: block.id,
                type: block.type,
                content: content,
                files: [],
            };
        });

        localStorage.setItem(
            "tfg-data",
            JSON.stringify({
                ...data,
                banner: data.banner && data.banner !== DEF_BANNER ? true : false,
                thumbnail: data.thumbnail ? true : false,
                content: saveBlocksData,
            })
        );
    };

    const updateErrorMessage = (data: Partial<MessageError>) => {
        setErrorMessages((m) => ({ ...m, ...data }));
    };

    const removeTutor = (id: number) => {
        const newTutors = form.tutor.filter((t) => t.id !== id);
        updateForm({ tutor: newTutors });
    };

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex relative overflow-hidden w-full">
            <div className="p-3 bg-gray-900 rounded-l-xl flex flex-col border-1 border-white/5 w-full md:w-[50%] lg:w-[450px]">
                <div className="leading-4 pb-1">
                    <span className="text-tiny text-gray-400">
                        Tus cambios se guardarán en este navegador <span className="font-bold">hasta que los envíes</span>. Si cambias de navegador o
                        dispositivo, no estarán disponibles
                    </span>
                </div>
                <div className="flex-1 relative">
                    <div className="absolute top-0 bottom-0 left-0 right-0">
                        <SimpleBar autoHide={false} className="h-full pr-4">
                            <div className="pt-5">
                                <Textarea
                                    label="Titulo"
                                    minRows={1}
                                    labelPlacement="outside"
                                    value={form.title}
                                    isInvalid={!!errorMessages.title}
                                    errorMessage={errorMessages.title}
                                    placeholder="La Inteligencia Artificial en la Industria del Entretenimiento"
                                    variant="underlined"
                                    onChange={(e) => {
                                        let errorMessage = "";
                                        if (isNullOrEmpty(e.target.value)) {
                                            errorMessage = defaultErrorMessages.title;
                                        }
                                        updateErrorMessage({ title: errorMessage });
                                        updateForm({ title: e.target.value });
                                    }}
                                />
                            </div>
                            <div className="pt-4">
                                <Textarea
                                    minRows={1}
                                    label="Descripción"
                                    labelPlacement="outside"
                                    isInvalid={!!errorMessages.description}
                                    errorMessage={errorMessages.description}
                                    variant="underlined"
                                    value={form.description}
                                    placeholder="Cómo la IA está cambiando la forma en que se crea y se consume el contenido de entretenimiento"
                                    onChange={(e) => {
                                        let errorMessage = "";
                                        if (isNullOrEmpty(e.target.value)) {
                                            errorMessage = defaultErrorMessages.description;
                                        }
                                        updateErrorMessage({ description: errorMessage });
                                        updateForm({ description: e.target.value });
                                    }}
                                />
                            </div>
                            {departments.length > 0 && (
                                <div className="pt-4">
                                    <Select
                                        isMultiline
                                        label="Departamento"
                                        onChange={(e) => {
                                            if (isNullOrEmpty(e.target.value)) return;
                                            updateForm({ departmentId: parseInt(e.target.value) });
                                        }}
                                        selectedKeys={[form.departmentId?.toString() ?? ""]}
                                        variant="underlined">
                                        {departments.map((d) => (
                                            <SelectItem key={d.id} textValue={toFirstLetterUppercase(d.name)}>
                                                <div className="whitespace-normal">
                                                    <span className="text-small">{toFirstLetterUppercase(d.name)}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            )}
                            {departments.length > 0 && (
                                <div className="pt-4">
                                    <Field>
                                        <Label className={"text-sm"}>
                                            Tutor/es{" "}
                                            <span className="text-tiny text-gray-400">
                                                {form.tutor.length > 0
                                                    ? `(${form.tutor.length} seleccionado${form.tutor.length > 1 ? "s" : ""})`
                                                    : ""}
                                            </span>{" "}
                                        </Label>
                                        <Combobox
                                            multiple
                                            immediate
                                            value={form.tutor}
                                            onChange={(value) => {
                                                if (value) updateForm({ tutor: value });
                                            }}
                                            onClose={() => setQuery("")}>
                                            <div className="relative">
                                                <ComboboxInput
                                                    className={clsx(
                                                        "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                                                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                                    )}
                                                    placeholder="Buscar..."
                                                    displayValue={(person: user) => person?.name}
                                                    onChange={(event) => setQuery(event.target.value)}
                                                />
                                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                                    <IconChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                                                </ComboboxButton>
                                            </div>

                                            <ComboboxOptions
                                                anchor="bottom"
                                                transition
                                                className={clsx(
                                                    "w-[var(--input-width)] rounded-xl border border-white/5 bg-black/85  backdrop-blur-md p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                                                    "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                                                )}>
                                                {filteredPeople.map((person) => (
                                                    <ComboboxOption
                                                        key={person.id}
                                                        value={person}
                                                        className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                        <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                        <div className="text-sm/6 text-white">{person.name}</div>
                                                    </ComboboxOption>
                                                ))}
                                            </ComboboxOptions>
                                        </Combobox>
                                    </Field>
                                    {form.tutor.length > 0 && (
                                        <div className="text-tiny pt-1 flex flex-wrap gap-1">
                                            {form.tutor.map((person) => (
                                                <Button
                                                    onClick={() => removeTutor(person.id)}
                                                    className={
                                                        "p-2 transition-colors hover:bg-white/10 bg-black/30 rounded-lg flex gap-2 items-center"
                                                    }
                                                    key={person.id}>
                                                    {person.name}
                                                    <IconX size={13} />
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <ImageDrop
                                className="pt-4"
                                id="banner"
                                maxSize={5 * 1024 * 1024}
                                aspectRatio={3 / 1}
                                label="Banner"
                                maxDimensions={{ width: 2400, height: 800 }}
                                autocrop={true}
                                onUpdate={(newImage: string, file: File | null) => {
                                    setBannerFile(file);
                                    updateForm({ banner: newImage });
                                }}
                                onRemove={() => {
                                    updateForm({ banner: DEF_BANNER });
                                }}
                            />
                            <ImageDrop
                                className="pt-4"
                                id="thumbnail"
                                maxSize={2 * 1024 * 1024}
                                aspectRatio={16 / 9}
                                label="Thumbnail"
                                autocrop={true}
                                maxDimensions={{ width: 400, height: 225 }}
                                onUpdate={(newImage: string, file: File | null) => {
                                    setThumbnail(file);
                                    updateForm({ thumbnail: newImage });
                                }}
                                onRemove={() => updateForm({ thumbnail: undefined })}
                            />

                            <Divider className="my-2" />
                            <BlockBuilder
                                blocks={form.content}
                                updateForm={updateForm}
                                updateFormBlock={updateFormBlock}
                                removeFileFromBlock={removeFileFromBlock}
                                className="pt-1"
                            />
                        </SimpleBar>
                    </div>
                </div>
            </div>
            <div
                className={clsx(
                    "flex-1 absolute md:relative bg-nova-darker-2 border-1 border-l-0 border-white/10 w-full left-0 top-0 transition-transform rounded-large md:rounded-r-xl md:rounded-l-none md:translate-x-0 shadow-dark overflow-hidden",
                    showPreview ? "translate-x-0 " : "translate-x-[105%]",
                    "z-20"
                )}>
                <div className="w-full bg-grid">
                    <TFG_Details TFG={TFG} />
                </div>
            </div>
            <NextUIButton
                onClick={() => setShowPreview((preview) => !preview)}
                className={clsx(
                    "fixed  md:hidden top-32 shadow-light-dark -right-3 flex gap-3 rounded-l-full px-7 py-3 z-50",
                    showPreview ? "bg-red-500" : "bg-blue-500 "
                )}>
                {showPreview ? (
                    <>
                        <IconEyeX /> Ocultar preview
                    </>
                ) : (
                    <>
                        <IconEye /> Ver preview
                    </>
                )}
            </NextUIButton>
        </div>
    );
}
