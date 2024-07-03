"use client";

import { Category, FullCollege, FullDepartment, FullUser, MessageError, ProjectFormData, Titulation, iFullTFG } from "@/app/types/interfaces";
import { isNullOrEmpty, normalizeText, roundTwoDecimals, toFirstLetterUppercase } from "@/app/utils/util";
import { useEffect, useRef, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import TFG_Details from "@/app/components/TFG/TFG_Details";
import { IconCheck, IconChevronDown, IconEye, IconEyeX, IconRestore, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import ImageDrop from "@/app/components/ImageDrop";
import { Spinner } from "@nextui-org/spinner";
import {
    DEF_BANNER,
    MAX_BANNER_SIZE,
    MAX_DESCRIPTION_LENGTH,
    MAX_LINK_LENGTH,
    MAX_TAGS,
    MAX_THUMBNAIL_SIZE,
    MAX_TITLE_LENGTH,
    MAX_TUTORS,
} from "@/app/types/defaultData";
import { deleteNonExistentImagesFromIndexedDB } from "@/app/lib/indexedDBHelper";
import { Divider } from "@nextui-org/divider";
import BlockBuilder from "@/app/components/BlockBuilder";
import { Button, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Input, Label, Textarea } from "@headlessui/react";
import { Button as NextUIButton } from "@nextui-org/button";
import { produce } from "immer";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { BLOCKSCHEMA, BlockInfo, iFile } from "@/app/components/TFG_BlockDefinitions/BlockDefs";
import { CharacterCounter, Required } from "@/app/components/BasicComponentes";
import * as v from "valibot";
import { HeadlessComplete, HeadlessBasic } from "@/app/lib/headlessUIStyle";
import { useDebouncedCallback } from "use-debounce";
import { SEARCH_INPUT_DELAY } from "@/app/lib/config";

const FormSchema = v.object({
    title: v.pipe(
        v.string(),
        v.nonEmpty("Por favor introduce un título"),
        v.maxLength(MAX_TITLE_LENGTH, `El título no puede ocupar más de ${MAX_TITLE_LENGTH} carácteres`)
    ),
    banner: v.pipe(
        v.blob("Por favor adjunta una imagen para el banner"),
        v.mimeType(["image/jpeg", "image/jpg", "image/png"], "Sólo archivos JPEG, JPG o PNG"),
        v.maxSize(MAX_BANNER_SIZE, `El banner no puede ocupar más de ${roundTwoDecimals(MAX_BANNER_SIZE)}Mb`)
    ),
    pages: v.pipe(v.number("El número de páginas debe ser un número"), v.notValue(0, "Por favor introduce un valor mayor a 0")),
    thumbnail: v.pipe(
        v.blob("Por favor adjunta una imagen para la miniatura"),
        v.mimeType(["image/jpeg", "image/jpg", "image/png"], "Sólo archivos JPEG, JPG o PNG"),
        v.maxSize(MAX_THUMBNAIL_SIZE, `El banner no puede ocupar más de ${roundTwoDecimals(MAX_THUMBNAIL_SIZE)}Mb`)
    ),
    description: v.pipe(
        v.string("El título debe ser texto"),
        v.nonEmpty("Por favor introduce una descripción"),
        v.maxLength(MAX_DESCRIPTION_LENGTH, `El título no puede ocupar más de ${MAX_DESCRIPTION_LENGTH} carácteres`)
    ),
    documentLink: v.pipe(
        v.string(),
        v.nonEmpty("Por favor introduce el enlace a tu memoria"),
        v.maxLength(MAX_LINK_LENGTH, `El enlace no puede tener más de ${MAX_LINK_LENGTH} carácteres`)
    ),
    departmentId: v.fallback(v.pipe(v.number(), v.notValue(0)), 1),
    collegeId: v.fallback(v.pipe(v.number(), v.notValue(0)), 1),
    categoryId: v.fallback(v.pipe(v.number(), v.notValue(0)), 1),
    titulationId: v.fallback(v.pipe(v.number(), v.notValue(0)), 1),
    tutor: v.pipe(v.array(v.number()), v.minLength(1, "Por favor selecciona al menos un tutor")),
    tags: v.pipe(v.array(v.string()), v.minLength(1, "Por favor selecciona al menos una tag")),
});

type Props = {
    college: FullCollege;
    departments: FullDepartment[];
    tutors: FullUser[];
    titulations: Titulation[];
    categories: Category[];
    popularTags: string[];
    tfg: ProjectFormData | null;
};

export default function ProjectForm({ college, departments, tutors, titulations, categories, popularTags, tfg }: Props) {
    const [isMounted, setIsMounted] = useState(false);
    const [bannerFile, setBannerFile] = useState<Blob | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<Blob | null>(null);
    const refresh = useRef(false);
    const [showPreview, setShowPreview] = useState(false);
    const [tutorQuery, setTutorQuery] = useState("");
    const defaultFormData = {
        id: -1,
        thumbnail: "",
        banner: DEF_BANNER,
        title: "",
        description: "",
        department: departments.length > 0 ? departments[0] : null,
        category: categories[0] ?? null,
        titulation: titulations[0] ?? null,
        pages: 0,
        tutor: [],
        contentBlocks: [],
        documentLink: "",
        tags: [],
    };

    const filteredTutors =
        tutorQuery === ""
            ? tutors
            : tutors.filter((tutor) => {
                  return tutor.name.toLowerCase().includes(tutorQuery.toLowerCase());
              });
    const [categoryQuery, setCategoryQuery] = useState("");
    const filteredCategories =
        categoryQuery === ""
            ? categories
            : categories.filter((category) => {
                  return category.name.toLowerCase().includes(categoryQuery.toLowerCase());
              });
    const [departmentQuery, setDepartmentQuery] = useState("");
    const filteredDepartments =
        departmentQuery === ""
            ? departments
            : departments.filter((department) => {
                  return department.name.toLowerCase().includes(departmentQuery.toLowerCase());
              });

    const [tagsQuery, setTagsQuery] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [isFetchingTags, setIsFetchingTags] = useState(false);

    const handleTagSearch = useDebouncedCallback((value: string) => {
        if (value.length > 1) {
            setIsFetchingTags(true);
            fetch("/api/tags?q=" + value)
                .then((res) => res.json())
                .then((data) => {
                    setTags(data.response);
                })
                .finally(() => {
                    setIsFetchingTags(false);
                });
        } else {
            setTags([]);
        }
    }, SEARCH_INPUT_DELAY);

    const [form, setForm] = useState<ProjectFormData>(tfg ? tfg : defaultFormData);

    const [errorMessages, setErrorMessages] = useState<MessageError>({
        thumbnail: "",
        banner: "",
        title: "",
        description: "",
        contentBlocks: "",
        pages: "",
        documentLink: "",
        tutor: "",
        tags: "",
    });

    const simplifiedBlocks = Object.values(form.contentBlocks).map((block) => ({
        type: block.type,
        params: block.params,
    }));

    const TFG: iFullTFG = {
        ...form,
        id: 0,
        author: [],
        tutor: form.tutor,
        department: form.department,
        pages: 0,
        documentLink: form.documentLink,
        views: 0,
        score: 0,
        createdAt: new Date(),
        contentBlocks: JSON.stringify(simplifiedBlocks),
        college: {
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
                    departmentId: data.department ?? categories[0]?.id ?? null,
                    pages: data.pages ?? 0,
                    category: data.category ?? categories[0] ?? null,
                    titulation: data.titulation ?? titulations[0] ?? null,
                    tutor: data.tutor ?? [],
                    contentBlocks: data.contentBlocks ?? "",
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
                Object.values(data.contentBlocks).forEach((c) => {
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

    const validateForm = () => {
        const result = v.safeParse(FormSchema, {
            title: form.title,
            banner: bannerFile,
            description: form.description,
            documentLink: form.documentLink,
            thumbnail: thumbnailFile,
            departmentId: form.department?.id ?? null,
            collegeId: college.id,
            categoryId: 0,
            pages: form.pages,
            titulationId: 0,
            tags: form.tags,
            tutor: form.tutor.map((t) => t.id),
        });
        result.issues?.forEach((issue) => {
            const path = issue.path?.[0] as any | undefined;
            if (path) {
                updateErrorMessage({ [path.key]: issue.message });
            }
        });

        let foundErrorsInBlocks = false;
        const updatedBlocks = produce(form.contentBlocks, (draft) => {
            draft.forEach((block) => {
                const schema = BLOCKSCHEMA[block.type];
                const missingParamsInBlock = v.safeParse(schema.VALIDATE, block.params.slice(0, schema.expectedParameters));
                if (missingParamsInBlock.issues) {
                    block.errors = missingParamsInBlock.issues.map((issue) => issue.message);
                    foundErrorsInBlocks = true;
                } else {
                    block.errors = [];
                }
            });
        });
        updateForm({ contentBlocks: updatedBlocks });

        if (!result.success || foundErrorsInBlocks) return false;
        return true;
    };

    const handleSubmit = () => {
        if (!bannerFile || !thumbnailFile) return;
        const formData = new FormData();
        formData.append("banner", bannerFile);
        formData.append("thumbnail", thumbnailFile);

        const blocks = form.contentBlocks.map((block) => {
            const cleanedContent = CleanContentImageBase64(block.type, block.params);
            return {
                blockId: block.id,
                files: block.files,
                blockType: block.type,
                contentBlocks: cleanedContent.slice(0, BLOCKSCHEMA[block.type].expectedParameters),
            };
        });

        blocks.forEach((block) => {
            block.files.forEach((blob) => {
                formData.append(`${block.blockId}-${blob.id}`, blob.blob);
            });
        });

        const tfgData = {
            title: form.title,
            description: form.description,
            content: blocks,
            pages: 0,
            documentLink: "",
            tags: [],
            departmentId: form.department?.id ?? null,
            collegeId: college.id,
        };

        formData.append("tfgData", JSON.stringify(tfgData));

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
                const target = draft.contentBlocks.find((contentBlock) => contentBlock.id === blockid);
                if (target) {
                    target.params[slotIndex] = content;

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

    const validateBlock = (blockId: number) => {
        setForm(
            produce((draft) => {
                const target = draft.contentBlocks.find((block) => block.id === blockId);
                if (target) {
                    const schema = BLOCKSCHEMA[target.type];
                    const missingParamsInBlock = v.safeParse(schema.VALIDATE, target.params.slice(0, schema.expectedParameters));
                    if (missingParamsInBlock.issues) {
                        target.errors = missingParamsInBlock.issues.map((issue) => issue.message);
                    } else {
                        target.errors = [];
                    }
                }
                saveToLocalStorage(draft);
            })
        );
    };

    const removeFileFromBlock = (blockid: number, fileIdToRemove: number, imageSrcSlot: number) => {
        setForm(
            produce((draft) => {
                const target = draft.contentBlocks.find((contentBlock) => contentBlock.id === blockid);
                if (target) {
                    target.params[imageSrcSlot] = "";
                    target.files = target.files.filter((file) => file.id !== fileIdToRemove);
                }
                saveToLocalStorage(draft);
            })
        );
    };

    const CleanContentImageBase64 = (blockType: number, params: string[]) => {
        const blockSchema = BLOCKSCHEMA[blockType];
        return params.map((c, i) => {
            const skipRule = blockSchema.SKIP_LOCAL_SAVE_UNLESS.find((rule) => rule.skip === i);
            if (skipRule) {
                const shouldKeep = skipRule.unless(params);
                if (!shouldKeep) {
                    return "";
                }
            }
            return c;
        });
    };

    const saveToLocalStorage = (data: ProjectFormData) => {
        const saveBlocksData: BlockInfo[] = data.contentBlocks.map((block) => {
            const params = CleanContentImageBase64(block.type, block.params);
            return {
                id: block.id,
                type: block.type,
                params: params,
                errors: block.errors,
                files: [],
            };
        });

        localStorage.setItem(
            "tfg-data",
            JSON.stringify({
                ...data,
                banner: data.banner && data.banner !== DEF_BANNER ? true : false,
                thumbnail: data.thumbnail ? true : false,
                contentBlocks: saveBlocksData,
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
                <div className="flex justify-end">
                    <NextUIButton
                        color="warning"
                        className="h-6 text-tiny flex items-center font-semi"
                        onClick={() => {
                            setForm(tfg ? tfg : defaultFormData);
                            localStorage.removeItem("tfg-data");
                            deleteNonExistentImagesFromIndexedDB([]);
                            refresh.current = !refresh.current;
                        }}>
                        <IconRestore size={12} /> Restaurar
                    </NextUIButton>
                </div>
                <div className="flex-1 relative">
                    <div className="absolute top-0 bottom-0 left-0 right-0">
                        <SimpleBar autoHide={false} className="h-full pr-4">
                            <div className="pt-5">
                                <Field>
                                    <Label className={"text-sm text-default-600 flex items-end"}>
                                        Título
                                        <Required />
                                        <CharacterCounter currentLength={form.title.length} max={MAX_TITLE_LENGTH} />
                                    </Label>
                                    <Textarea
                                        value={form.title}
                                        invalid={!!errorMessages.title}
                                        placeholder="La Inteligencia Artificial en la Industria del Entretenimiento"
                                        className={clsx("resize-none", HeadlessComplete)}
                                        onChange={(e) => {
                                            const validateResult = v.safeParse(FormSchema.entries.title, e.target.value);
                                            updateErrorMessage({ title: validateResult.issues?.[0].message ?? "" });
                                            updateForm({ title: e.target.value });
                                        }}
                                    />
                                    <div className="error-message">{errorMessages.title}</div>
                                </Field>
                            </div>
                            <ImageDrop
                                isRequired
                                refresh={refresh.current}
                                defaultImage={form.banner === DEF_BANNER ? undefined : form.banner}
                                invalid={!!errorMessages.banner}
                                _errorMessage={errorMessages.banner}
                                className="pt-4"
                                id="banner"
                                maxSize={5 * 1024 * 1024}
                                aspectRatio={3 / 1}
                                label="Banner"
                                maxDimensions={{ width: 2400, height: 800 }}
                                autocrop={true}
                                onUpdate={(newImage: string, blob: Blob | null) => {
                                    updateErrorMessage({ banner: "" });
                                    setBannerFile(blob);
                                    updateForm({ banner: newImage });
                                }}
                                onRemove={() => {
                                    setBannerFile(null);
                                    updateForm({ banner: DEF_BANNER });
                                }}
                            />

                            <div className="pt-3">
                                <Field>
                                    <Label className={"text-sm text-default-600 flex items-end"}>
                                        Descripción
                                        <Required />
                                        <CharacterCounter currentLength={form.description.length} max={MAX_DESCRIPTION_LENGTH} />
                                    </Label>
                                    <Textarea
                                        value={form.description}
                                        invalid={!!errorMessages.description}
                                        placeholder="Cómo la IA está cambiando la forma en que se crea y se consume el contenido de entretenimiento"
                                        className={clsx(HeadlessComplete)}
                                        rows={5}
                                        onChange={(e) => {
                                            const validateResult = v.safeParse(FormSchema.entries.description, e.target.value);
                                            updateErrorMessage({ description: validateResult.issues?.[0].message ?? "" });
                                            updateForm({ description: e.target.value });
                                        }}
                                    />
                                    <div className="error-message">{errorMessages.description}</div>
                                </Field>
                            </div>
                            <Field className={"mt-3"}>
                                <Label className={"text-sm text-default-600 flex items-end"}>
                                    Enlace a tu memoria
                                    <Required />
                                    <CharacterCounter currentLength={form.documentLink.length} max={MAX_LINK_LENGTH} />
                                </Label>
                                <Input
                                    value={form.documentLink}
                                    invalid={!!errorMessages.documentLink}
                                    onChange={(e) => {
                                        const validateResult = v.safeParse(FormSchema.entries.documentLink, e.target.value);
                                        updateErrorMessage({ documentLink: validateResult.issues?.[0].message ?? "" });
                                        updateForm({ documentLink: e.target.value });
                                    }}
                                    className={clsx(HeadlessComplete)}
                                    placeholder="https://..."
                                />
                                <div className="error-message">{errorMessages.documentLink}</div>
                            </Field>
                            <section className="flex justify-end">
                                <Field className={"max-w-40"}>
                                    <Label className={"text-tiny text-default-600 flex items-end"}>
                                        Número de páginas
                                        <Required />
                                    </Label>
                                    <Input
                                        value={form.pages}
                                        type="number"
                                        step={1}
                                        min={0}
                                        invalid={!!errorMessages.pages}
                                        onChange={(e) => {
                                            const validateResult = v.safeParse(FormSchema.entries.pages, parseInt(e.target.value));
                                            updateErrorMessage({ pages: validateResult.issues?.[0].message ?? "" });
                                            let pages = parseInt(e.target.value);
                                            if (isNaN(pages)) pages = 0;
                                            updateForm({ pages: pages });
                                        }}
                                        className={clsx(HeadlessComplete, "h-7")}
                                    />
                                    <div className="error-message">{errorMessages.pages}</div>
                                </Field>
                            </section>
                            {titulations.length > 0 && (
                                <Field className={"mt-3"}>
                                    <Label className={"text-sm text-default-600"}>
                                        Titulación
                                        <Required />
                                    </Label>
                                    <Combobox
                                        immediate
                                        value={form.titulation}
                                        onChange={(value) => {
                                            if (value) {
                                                updateForm({ titulation: value });
                                            }
                                        }}
                                        onClose={() => setCategoryQuery("")}>
                                        <div className="relative">
                                            <ComboboxInput
                                                className={clsx(
                                                    "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                                                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                                )}
                                                placeholder="Buscar..."
                                                displayValue={(titulation: Titulation) => titulation?.name}
                                                onChange={(event) => setCategoryQuery(event.target.value)}
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
                                            {filteredCategories.map((titulation) => (
                                                <ComboboxOption
                                                    key={titulation.id}
                                                    value={titulation}
                                                    className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                    <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                    <div className="text-sm/6 text-white">{titulation.name}</div>
                                                </ComboboxOption>
                                            ))}
                                        </ComboboxOptions>
                                    </Combobox>
                                </Field>
                            )}
                            {categories.length > 0 && (
                                <Field className={"mt-3"}>
                                    <Label className={"text-sm text-default-600"}>
                                        Categoria
                                        <Required />
                                    </Label>
                                    <Combobox
                                        immediate
                                        value={form.category}
                                        onChange={(value) => {
                                            if (value) {
                                                updateForm({ category: value });
                                            }
                                        }}
                                        onClose={() => setCategoryQuery("")}>
                                        <div className="relative">
                                            <ComboboxInput
                                                className={clsx(
                                                    "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                                                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                                )}
                                                placeholder="Buscar..."
                                                displayValue={(category: Category) => category?.name}
                                                onChange={(event) => setCategoryQuery(event.target.value)}
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
                                            {filteredCategories.map((category) => (
                                                <ComboboxOption
                                                    key={category.id}
                                                    value={category}
                                                    className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                    <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                    <div className="text-sm/6 text-white">{category.name}</div>
                                                </ComboboxOption>
                                            ))}
                                        </ComboboxOptions>
                                    </Combobox>
                                </Field>
                            )}
                            {departments.length > 0 && (
                                <Field className={"mt-3"}>
                                    <Label className={"text-sm text-default-600"}>
                                        Departamento
                                        <Required />
                                    </Label>
                                    <Combobox immediate value={form.department} onChange={(e) => updateForm({ department: e })}>
                                        <div className="relative">
                                            <ComboboxInput
                                                className={clsx(
                                                    "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                                                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                                )}
                                                placeholder="Buscar..."
                                                displayValue={(department: FullDepartment) => department?.name}
                                                onChange={(event) => setCategoryQuery(event.target.value)}
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
                                            <ComboboxOption
                                                key={-1}
                                                value={null}
                                                className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                <div className="text-sm/6 text-default-600">(Ninguno)</div>
                                            </ComboboxOption>
                                            {filteredDepartments.map((department) => (
                                                <ComboboxOption
                                                    key={department.id}
                                                    value={department}
                                                    className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                    <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                    <div className="text-sm/6 text-white">{department.name}</div>
                                                </ComboboxOption>
                                            ))}
                                        </ComboboxOptions>
                                    </Combobox>
                                </Field>
                            )}
                            {tutors.length > 0 && (
                                <div className="mt-3">
                                    <Field>
                                        <Label className={"text-sm text-default-600 flex items-end"}>
                                            Tutor/es
                                            <Required />
                                            <span className="text-tiny text-gray-400">
                                                {form.tutor.length > 0
                                                    ? `(${form.tutor.length} seleccionado${form.tutor.length > 1 ? "s" : ""})`
                                                    : ""}
                                            </span>
                                            <div className="text-tiny text-default-600 ml-auto">MAX: {MAX_TUTORS}</div>
                                        </Label>
                                        <Combobox
                                            multiple
                                            immediate
                                            value={form.tutor}
                                            onChange={(value) => {
                                                if (value.length > MAX_TUTORS) {
                                                    value.splice(MAX_TUTORS, value.length - MAX_TUTORS);
                                                }
                                                const validateResult = v.safeParse(
                                                    FormSchema.entries.tutor,
                                                    value.map((tutor: FullUser) => tutor.id)
                                                );
                                                updateErrorMessage({ tutor: validateResult.issues?.[0].message ?? "" });
                                                updateForm({ tutor: value });
                                            }}>
                                            <div className="relative">
                                                <ComboboxInput
                                                    className={clsx(
                                                        "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                                                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                                                        !!errorMessages.tutor && "outline-2 outline -outline-offset-2 outline-nova-error/75"
                                                    )}
                                                    placeholder="Buscar..."
                                                    value={tutorQuery}
                                                    onChange={(event) => setTutorQuery(event.target.value)}
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
                                                {filteredTutors.map((tutor) => (
                                                    <ComboboxOption
                                                        key={tutor.id}
                                                        value={tutor}
                                                        className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                        <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                        <div className="text-sm/6 text-white">{tutor.name}</div>
                                                    </ComboboxOption>
                                                ))}
                                            </ComboboxOptions>
                                        </Combobox>
                                        <div className="error-message">{errorMessages.tutor}</div>
                                    </Field>
                                    {form.tutor.length > 0 && (
                                        <div className="text-tiny pt-1 flex flex-wrap gap-1">
                                            {form.tutor.map((tutor) => (
                                                <Button
                                                    onClick={() => {
                                                        if (form.tutor.length === 1) {
                                                            const validateResult = v.safeParse(FormSchema.entries.tutor, []);
                                                            updateErrorMessage({ tutor: validateResult.issues?.[0].message ?? "" });
                                                        }
                                                        removeTutor(tutor.id);
                                                    }}
                                                    className={
                                                        "p-2 transition-colors hover:bg-white/10 bg-black/30 rounded-lg flex gap-2 items-center"
                                                    }
                                                    key={tutor.id}>
                                                    {tutor.name}
                                                    <IconX size={13} />
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <ImageDrop
                                isRequired
                                refresh={refresh.current}
                                defaultImage={form.thumbnail}
                                invalid={!!errorMessages.thumbnail}
                                _errorMessage={errorMessages.thumbnail}
                                className="pt-4"
                                id="thumbnail"
                                maxSize={MAX_THUMBNAIL_SIZE}
                                aspectRatio={16 / 9}
                                label="Thumbnail"
                                autocrop={true}
                                maxDimensions={{ width: 400, height: 225 }}
                                onUpdate={(newImage: string, blob: Blob | null) => {
                                    updateErrorMessage({ thumbnail: "" });
                                    setThumbnailFile(blob);
                                    updateForm({ thumbnail: newImage });
                                }}
                                onRemove={() => {
                                    setThumbnailFile(null);
                                    updateForm({ thumbnail: undefined });
                                }}
                            />

                            <div className="mt-3">
                                <Field>
                                    <Label className={"text-sm text-default-600 flex items-end"}>
                                        Tags
                                        <Required />{" "}
                                        <span className="text-tiny text-gray-400">
                                            {form.tags.length > 0 ? `(${form.tags.length} seleccionada${form.tags.length > 1 ? "s" : ""})` : ""}
                                        </span>{" "}
                                        <div className="text-tiny text-default-600 ml-auto">MAX: {MAX_TAGS}</div>
                                    </Label>
                                    <Combobox
                                        multiple
                                        immediate
                                        value={form.tags}
                                        onChange={(value) => {
                                            if (value.length > MAX_TAGS) {
                                                value.splice(MAX_TAGS, value.length - MAX_TAGS);
                                            }
                                            const validateResult = v.safeParse(FormSchema.entries.tags, value);
                                            updateErrorMessage({ tags: validateResult.issues?.[0].message ?? "" });
                                            updateForm({ tags: value });
                                        }}>
                                        <div className="relative">
                                            <ComboboxInput
                                                className={clsx(
                                                    "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                                                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                                                    !!errorMessages.tags ? "outline-2 outline -outline-offset-2 outline-nova-error/75" : ""
                                                )}
                                                value={tagsQuery}
                                                placeholder="Buscar..."
                                                onChange={(event) => {
                                                    const tagInput = normalizeText(event.target.value);
                                                    setTagsQuery(tagInput);
                                                    handleTagSearch(tagInput);
                                                }}
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
                                            {tagsQuery.length > 0 && (
                                                <ComboboxOption
                                                    value={tagsQuery}
                                                    className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                    <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                    <div className="text-sm/6 text-white">
                                                        <span className="text-blue-500">#</span>
                                                        {tagsQuery}
                                                    </div>
                                                </ComboboxOption>
                                            )}
                                            {tagsQuery.length > 0 && tags.length > 0 && <Divider className="my-1" />}
                                            {isFetchingTags ? (
                                                <div className="w-full flex items-center justify-center py-3">
                                                    <Spinner />
                                                </div>
                                            ) : tags.length === 0 ? (
                                                <>
                                                    <div className="text-tiny text-default-600 py-1 px-2">Popular tags</div>
                                                    <div className="px-2">
                                                        <Divider />
                                                    </div>
                                                    {popularTags.map((tag) => (
                                                        <ComboboxOption
                                                            key={tag}
                                                            value={tag}
                                                            className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                            <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                            <div className="text-sm/6 text-white">
                                                                <span className="text-blue-500">#</span>
                                                                {tag}
                                                            </div>
                                                        </ComboboxOption>
                                                    ))}
                                                </>
                                            ) : (
                                                tags.map((tag) => (
                                                    <ComboboxOption
                                                        key={tag}
                                                        value={tag}
                                                        className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                                        <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                        <div className="text-sm/6 text-white">
                                                            <span className="text-blue-500">#</span>
                                                            {tag}
                                                        </div>
                                                    </ComboboxOption>
                                                ))
                                            )}
                                        </ComboboxOptions>
                                    </Combobox>
                                    <div className="error-message">{errorMessages.tags}</div>
                                </Field>
                                {form.tags.length > 0 && (
                                    <div className="text-tiny pt-1 flex flex-wrap gap-1">
                                        {form.tags.map((tag) => (
                                            <Button
                                                onClick={() => {
                                                    if (form.tags.length === 1) {
                                                        const validateResult = v.safeParse(FormSchema.entries.tags, []);
                                                        updateErrorMessage({ tags: validateResult.issues?.[0].message ?? "" });
                                                    }
                                                    updateForm({ tags: form.tags.filter((t) => t !== tag) });
                                                }}
                                                className={"p-2 transition-colors hover:bg-white/10 bg-black/30 rounded-lg flex gap-1 items-center"}
                                                key={tag}>
                                                <span>
                                                    <span className="text-blue-500">#</span>
                                                    {tag}
                                                </span>
                                                <IconX size={13} />
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Divider className="my-2" />
                            <BlockBuilder
                                blocks={form.contentBlocks}
                                updateForm={updateForm}
                                updateFormBlock={updateFormBlock}
                                removeFileFromBlock={removeFileFromBlock}
                                validateBlock={validateBlock}
                                className="pt-1"
                            />
                        </SimpleBar>
                    </div>
                </div>
                <div className="pt-5">
                    <NextUIButton onClick={validateForm} color="success" className={"w-full"}>
                        Enviar
                    </NextUIButton>
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
