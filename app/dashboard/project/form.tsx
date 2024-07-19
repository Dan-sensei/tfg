"use client";

import {
    Category,
    FullCollege,
    FullDepartment,
    FullUser,
    MessageError,
    ProjectFormData,
    ProjectFromDataSend,
    Titulation,
    iDetailsTFG,
} from "@/app/types/interfaces";
import { normalizeText } from "@/app/utils/util";
import { useEffect, useRef, useState } from "react";
import TFG_Details from "@/app/components/TFG/TFG_Details";
import { IconCheck, IconChevronDown, IconEye, IconEyeX, IconLockSquareRoundedFilled, IconRestore, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import ImageDrop from "@/app/components/ImageDrop";
import { Spinner } from "@nextui-org/spinner";
import {
    DEF_BANNER,
    partialDefaultProjectData,
    MAX_BANNER_SIZE,
    MAX_DESCRIPTION_LENGTH,
    MAX_LINK_LENGTH,
    MAX_TAGS,
    MAX_THUMBNAIL_SIZE,
    MAX_TITLE_LENGTH,
    MAX_TUTORS,
    MAX_BANNER_DIMENSIONS,
    MAX_THUMBNAIL_DIMENSIONS,
} from "@/app/types/defaultData";
import { deleteNonExistentImagesFromIndexedDB } from "@/app/lib/indexedDBHelper";
import { Divider } from "@nextui-org/divider";
import BlockBuilder from "@/app/components/BlockBuilder";
import {
    Button,
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Field,
    Input,
    Label,
    Textarea,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from "@headlessui/react";
import { Button as NextUIButton } from "@nextui-org/button";
import { produce } from "immer";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { BLOCKSCHEMA, BlockInfo, FormSchema, iFile, localStorageBlob } from "@/app/components/TFG_BlockDefinitions/BlockDefs";
import { CharacterCounter, Required } from "@/app/components/BasicComponents";
import * as v from "valibot";
import { HeadlessComplete } from "@/app/lib/headlessUIStyle";
import { useDebouncedCallback } from "use-debounce";
import { SEARCH_INPUT_DELAY } from "@/app/lib/config";
import Autocomplete from "@/app/components/Autocomplete";
import CreateProjectButton from "@/app/components/dashboardComponents/createProject";
import SimpleBarAbs from "@/app/components/SimpleBarAbs";
import { useToast } from "@/app/contexts/ToasterContext";
import Chatbox from "@/app/components/dashboardComponents/Chatbox";
import { TFGStatus } from "@/app/lib/enums";

type Props = {
    college: FullCollege;
    departments: FullDepartment[];
    tutors: FullUser[];
    titulations: Titulation[];
    categories: Category[];
    authors: FullUser[];
    popularTags: string[];
    tfg: ProjectFormData | null;
    projectStatus: TFGStatus | null;
};

export default function ProjectForm({ college, authors, departments, tutors, titulations, categories, popularTags, tfg, projectStatus }: Props) {
    const [isMounted, setIsMounted] = useState(false);
    const defaultData = useRef<ProjectFormData | null>(tfg);
    const [bannerFile, setBannerFile] = useState<Blob | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<Blob | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [tutorQuery, setTutorQuery] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const defaultFormData = {
        ...partialDefaultProjectData,
        category: categories[0] ?? null,
        titulation: titulations[0] ?? null,
    };
    const { toast } = useToast();

    const filteredTutors =
        tutorQuery === ""
            ? tutors
            : tutors.filter((tutor) => {
                  return tutor.name.toLowerCase().includes(tutorQuery.toLowerCase());
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
        tutors: "",
        tags: "",
    });

    const simplifiedBlocks = Object.values(form.contentBlocks).map((block) => ({
        type: block.type,
        data: block.data,
    }));

    const TFG: iDetailsTFG = {
        ...form,
        id: 0,
        author: authors,
        tutors: form.tutors,
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
        setIsMounted(true);
        if (!defaultData.current) return;
        const tfgSavedData = localStorage.getItem(`tfg-data-${tfg?.id}`);
        const existingImages: string[] = [];
        if (tfgSavedData) {
            try {
                const data = JSON.parse(tfgSavedData) as ProjectFormData;
                const department =
                    departments.find((d) => d.id === data.department?.id) ?? departments.find((d) => d.id === defaultData.current?.department?.id);
                const titulation =
                    titulations.find((t) => t.id === data.titulation?.id) ?? titulations.find((t) => t.id === defaultData.current?.titulation?.id);
                const category =
                    categories.find((c) => c.id === data.category?.id) ?? categories.find((c) => c.id === defaultData.current?.category?.id);
                const _tutors = data.tutors.map((t) => tutors.find((u) => u.id === t.id)).filter((tutor) => tutor !== undefined);

                setForm((current) => ({
                    ...current,
                    title: data.title ?? "",
                    banner: data.banner,
                    thumbnail: data.thumbnail,
                    description: data.description ?? "",
                    department: department ?? departments[0] ?? null,
                    pages: data.pages ?? 0,
                    category: category ?? categories[0] ?? null,
                    titulation: titulation ?? titulations[0] ?? null,
                    tutors: _tutors,
                    contentBlocks: data.contentBlocks ?? "",
                    documentLink: data.documentLink ?? "",
                    tags: data.tags ?? [],
                }));

                if (data.banner) {
                    existingImages.push("banner");
                    existingImages.push("ubanner");
                }
                if (data.thumbnail === localStorageBlob) {
                    existingImages.push("thumbnail");
                    existingImages.push("uthumbnail");
                }
                Object.values(data.contentBlocks).forEach((c) => {
                    existingImages.push(`block-${c.id}`);
                    existingImages.push(`ublock-${c.id}`);
                });
            } catch (e) {
                localStorage.removeItem(`tfg-data-${tfg?.id}`);
            }
        }
        deleteNonExistentImagesFromIndexedDB(existingImages);
    }, []);

    const validateForm = () => {
        const result = v.safeParse(FormSchema, {
            title: form.title,
            banner: bannerFile ?? (form.banner === DEF_BANNER ? null : form.banner),
            description: form.description,
            documentLink: form.documentLink,
            thumbnail: thumbnailFile ?? form.thumbnail,
            departmentId: form.department ? form.department.id : null,
            collegeId: college.id,
            categoryId: form.category.id,
            pages: form.pages,
            titulationId: form.titulation.id,
            tags: form.tags,
            tutors: form.tutors.map((t) => t.id),
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
                const missingParamsInBlock = schema.VALIDATE(block.data);
                if (missingParamsInBlock.issues) {
                    block.errors = missingParamsInBlock.issues.map((issue) => issue.message);
                    foundErrorsInBlocks = true;
                } else {
                    block.errors = [];
                }
            });
        });
        if (!result.success || foundErrorsInBlocks) {
            updateForm({ contentBlocks: updatedBlocks });
            return;
        }
        return { ...result.output, contentBlocks: updatedBlocks };
    };

    const handleSubmit = () => {
        const data = validateForm();
        if (!data) return;
        const formData = new FormData();
        if (data.banner instanceof Blob) formData.append("banner", data.banner);
        if (data.thumbnail instanceof Blob) formData.append("thumbnail", data.thumbnail);

        const blocks: BlockInfo[] = data.contentBlocks.map((block) => {
            const cleanedContent = BLOCKSCHEMA[block.type].prepareForLocalStorage(block.data);
            return {
                id: block.id,
                files: block.files,
                type: block.type,
                data: cleanedContent,
                errors: [],
            };
        });

        blocks.forEach((block) => {
            block.files.forEach((blob) => {
                formData.append(`block-${block.id}-${blob.id}`, blob.blob);
            });
        });

        const projectData: ProjectFromDataSend = {
            title: data.title,
            banner: typeof data.banner === "string" ? data.banner : null,
            description: data.description,
            documentLink: data.documentLink,
            pages: data.pages,
            titulationId: data.titulationId,
            categoryId: data.categoryId,
            departmentId: data.departmentId,
            thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : null,
            tags: data.tags,
            contentBlocks: blocks,
            tutors: data.tutors,
            collegeId: college.id,
        };

        formData.append("projectData", JSON.stringify(projectData));

        setIsSaving(true);
        fetch("/api/dashboard/tfg/save", {
            method: "PUT",
            body: formData,
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.success) {
                    toast.success("TFG guardado con éxito. Recargando...");
                    deleteNonExistentImagesFromIndexedDB([]);
                    localStorage.removeItem(`tfg-data-${tfg?.id}`);
                    location.reload();
                } else {
                    toast.error(json.response);
                }
            })
            .catch((e) => console.error(e))
            .finally(() => setIsSaving(false));
    };

    const updateForm = (data: Partial<ProjectFormData>) => {
        setForm(
            produce((draft) => {
                Object.assign(draft, data);
                saveToLocalStorage(draft);
            })
        );
    };

    const updateFormBlock = (blockid: number, content: string) => {
        setForm(
            produce((draft) => {
                const target = draft.contentBlocks.find((contentBlock) => contentBlock.id === blockid);
                if (target) {
                    target.data = content;
                }
                saveToLocalStorage(draft);
            })
        );
    };

    const addFileToBlock = (blockid: number, file: iFile) => {
        setForm(
            produce((draft) => {
                const target = draft.contentBlocks.find((contentBlock) => contentBlock.id === blockid);
                if (target) {
                    const targetFile = target.files.findIndex((f) => f.id === file.id);
                    if (targetFile > -1) target.files[targetFile] = file;
                    else target.files.push(file);
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
                    const missingParamsInBlock = schema.VALIDATE(target.data);
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

    const removeFileFromBlock = (blockid: number, fileIdToRemove: string) => {
        setForm(
            produce((draft) => {
                const target = draft.contentBlocks.find((contentBlock) => contentBlock.id === blockid);
                if (target) {
                    target.files = target.files.filter((file) => file.id !== fileIdToRemove);
                }
                saveToLocalStorage(draft);
            })
        );
    };

    const saveToLocalStorage = (data: ProjectFormData) => {
        const saveBlocksData: BlockInfo[] = data.contentBlocks.map((block) => {
            const data = BLOCKSCHEMA[block.type].prepareForLocalStorage(block.data);
            return {
                id: block.id,
                type: block.type,
                data: data,
                errors: block.errors,
                files: [],
            };
        });
        localStorage.setItem(
            `tfg-data-${tfg?.id}`,
            JSON.stringify({
                ...data,
                banner: data.banner && !data.banner.startsWith("data:") ? data.banner : localStorageBlob,
                thumbnail: data.thumbnail && !data.thumbnail.startsWith("data:") ? data.thumbnail : localStorageBlob,
                contentBlocks: saveBlocksData,
            })
        );
    };

    const updateErrorMessage = (data: Partial<MessageError>) => {
        setErrorMessages((m) => ({ ...m, ...data }));
    };

    const removeTutor = (id: number) => {
        const newTutors = form.tutors.filter((t) => t.id !== id);
        updateForm({ tutors: newTutors });
    };

    return (
        <>
            {!isMounted ? (
                <div className="flex items-center justify-center w-full">
                    <Spinner size="lg" />
                </div>
            ) : form.id === defaultFormData.id ? (
                <div className="flex items-center justify-center flex-col w-full bg-grid">
                    <CreateProjectButton
                        onCreate={(newProject: ProjectFormData) => {
                            defaultData.current = newProject;
                            setForm(newProject);
                        }}
                        toast={toast}
                    />
                </div>
            ) : (
                <div className="flex relative overflow-hidden w-full">
                    <TabGroup className="p-3 bg-gray-900 rounded-l-xl flex flex-col border-1 border-white/5 w-full md:w-[50%] lg:w-[450px]">
                        <TabList className="flex gap-3">
                            <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                Editor
                            </Tab>
                            <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                Mensajes
                            </Tab>
                        </TabList>
                        <TabPanels className="mt-3 flex-1 relative">
                            <TabPanel className={clsx("h-full flex flex-col")}>
                                {projectStatus === TFGStatus.PUBLISHED && (
                                    <div className="absolute flex flex-col gap-4 items-center justify-center px-5 z-10 border-2 border-yellow-500/50 border-dashed rounded-lg top-0 right-0 bottom-0 left-0 text-center">
                                        <IconLockSquareRoundedFilled size={60} />
                                        Este proyecto ha sido publicado y ya no se puede modificar
                                        <p>Si necesitas editarlo, envía un mensaje solicitando para que un tutor habilite su edición</p>
                                    </div>
                                )}
                                <div
                                    className={clsx(
                                        "h-full flex flex-col",
                                        projectStatus === TFGStatus.PUBLISHED && "opacity-10 pointer-events-none"
                                    )}>
                                    <div className="leading-4 pb-1">
                                        <span className="text-tiny text-gray-400">
                                            Tus cambios se guardarán en este navegador <span className="font-bold">hasta que los envíes</span>. Si
                                            cambias de navegador o dispositivo, no estarán disponibles
                                        </span>
                                    </div>
                                    <div className={clsx("flex-1 relative", isSaving && "opacity-60 pointer-events-none")}>
                                        <div className="absolute top-0 bottom-0 left-0 right-0">
                                            <SimpleBar autoHide={false} className="h-full pr-4">
                                                <div className="flex justify-center pt-3">
                                                    <NextUIButton
                                                        color="warning"
                                                        className="h-6 text-tiny flex items-center font-semi"
                                                        onClick={() => {
                                                            setForm(
                                                                produce((draft) => {
                                                                    const { id, ...newData } = defaultData.current ?? defaultFormData;
                                                                    Object.assign(draft, newData);
                                                                })
                                                            );
                                                            setBannerFile(null);
                                                            setThumbnailFile(null);
                                                            localStorage.removeItem(`tfg-data-${tfg?.id}`);
                                                            deleteNonExistentImagesFromIndexedDB([]);
                                                        }}>
                                                        <IconRestore size={12} /> Restaurar
                                                    </NextUIButton>
                                                </div>
                                                <div className="pt-3">
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
                                                            className={clsx("resize-none rounded-lg", HeadlessComplete)}
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
                                                    defaultImage={form.banner === localStorageBlob || form.banner === DEF_BANNER ? null : form.banner}
                                                    invalid={!!errorMessages.banner}
                                                    _errorMessage={errorMessages.banner}
                                                    className="pt-4"
                                                    id="banner"
                                                    maxSize={MAX_BANNER_SIZE}
                                                    aspectRatio={3 / 1}
                                                    label="Banner"
                                                    maxDimensions={MAX_BANNER_DIMENSIONS}
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
                                                            className={clsx(HeadlessComplete, "rounded-lg")}
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
                                                        className={clsx(HeadlessComplete, "rounded-lg")}
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
                                                                const validateResult = v.safeParse(
                                                                    FormSchema.entries.pages,
                                                                    parseInt(e.target.value)
                                                                );
                                                                updateErrorMessage({ pages: validateResult.issues?.[0].message ?? "" });
                                                                let pages = parseInt(e.target.value);
                                                                if (isNaN(pages)) pages = 0;
                                                                updateForm({ pages: pages });
                                                            }}
                                                            className={clsx(HeadlessComplete, "h-7 rounded-lg")}
                                                        />
                                                        <div className="error-message">{errorMessages.pages}</div>
                                                    </Field>
                                                </section>
                                                {titulations.length > 0 && (
                                                    <Autocomplete
                                                        required
                                                        label="Titulación"
                                                        placeholder="Buscar..."
                                                        data={titulations}
                                                        value={form.titulation}
                                                        onChange={(value) => {
                                                            if (value) updateForm({ titulation: value });
                                                        }}
                                                        displayValue={(titulation: Titulation | null) =>
                                                            titulation ? titulation.name : "Selecciona una titulación"
                                                        }
                                                    />
                                                )}
                                                {categories.length > 0 && (
                                                    <Autocomplete
                                                        required
                                                        label="Categoría"
                                                        placeholder="Buscar..."
                                                        data={categories}
                                                        value={form.category}
                                                        onChange={(value) => {
                                                            if (value) updateForm({ category: value });
                                                        }}
                                                        displayValue={(category: Category | null) =>
                                                            category ? category.name : "Selecciona una categoría"
                                                        }
                                                    />
                                                )}
                                                {departments.length > 0 && (
                                                    <Autocomplete
                                                        label="Departamento"
                                                        placeholder="Buscar..."
                                                        data={departments}
                                                        value={form.department}
                                                        onChange={(value) => {
                                                            updateForm({ department: value });
                                                        }}
                                                        displayValue={(department: FullDepartment | null) =>
                                                            department ? department.name : "(Ninguno)"
                                                        }
                                                    />
                                                )}
                                                {tutors.length > 0 && (
                                                    <div className="mt-3">
                                                        <Field>
                                                            <Label className={"text-sm text-default-600 flex items-end"}>
                                                                Tutor/es
                                                                <Required />
                                                                <span className="text-tiny text-gray-400">
                                                                    {form.tutors.length > 0
                                                                        ? `(${form.tutors.length} seleccionado${form.tutors.length > 1 ? "s" : ""})`
                                                                        : ""}
                                                                </span>
                                                                <div className="text-tiny text-default-600 ml-auto">MAX: {MAX_TUTORS}</div>
                                                            </Label>
                                                            <Combobox
                                                                multiple
                                                                immediate
                                                                value={form.tutors}
                                                                onChange={(value) => {
                                                                    if (value.length > MAX_TUTORS) {
                                                                        value.splice(MAX_TUTORS, value.length - MAX_TUTORS);
                                                                    }
                                                                    const validateResult = v.safeParse(
                                                                        FormSchema.entries.tutors,
                                                                        value.map((tutor: FullUser) => tutor.id)
                                                                    );
                                                                    updateErrorMessage({ tutors: validateResult.issues?.[0].message ?? "" });
                                                                    updateForm({ tutors: value });
                                                                }}>
                                                                <div className="relative">
                                                                    <ComboboxInput
                                                                        className={clsx(
                                                                            "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                                                                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                                                                            !!errorMessages.tutors &&
                                                                                "outline-2 outline -outline-offset-2 outline-nova-error/75"
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
                                                            <div className="error-message">{errorMessages.tutors}</div>
                                                        </Field>
                                                        {form.tutors.length > 0 && (
                                                            <div className="text-tiny pt-1 flex flex-wrap gap-1">
                                                                {form.tutors.map((tutor) => (
                                                                    <Button
                                                                        onClick={() => {
                                                                            if (form.tutors.length === 1) {
                                                                                const validateResult = v.safeParse(FormSchema.entries.tutors, []);
                                                                                updateErrorMessage({
                                                                                    tutors: validateResult.issues?.[0].message ?? "",
                                                                                });
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
                                                    defaultImage={form.thumbnail === localStorageBlob ? null : form.thumbnail}
                                                    invalid={!!errorMessages.thumbnail}
                                                    _errorMessage={errorMessages.thumbnail}
                                                    className="pt-4"
                                                    id="thumbnail"
                                                    maxSize={MAX_THUMBNAIL_SIZE}
                                                    aspectRatio={16 / 9}
                                                    label="Thumbnail"
                                                    autocrop={true}
                                                    maxDimensions={MAX_THUMBNAIL_DIMENSIONS}
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
                                                                {form.tags.length > 0
                                                                    ? `(${form.tags.length} seleccionada${form.tags.length > 1 ? "s" : ""})`
                                                                    : ""}
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
                                                                        !!errorMessages.tags
                                                                            ? "outline-2 outline -outline-offset-2 outline-nova-error/75"
                                                                            : ""
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
                                                                    className={
                                                                        "p-2 transition-colors hover:bg-white/10 bg-black/30 rounded-lg flex gap-1 items-center"
                                                                    }
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
                                                    addFileToBlock={addFileToBlock}
                                                    validateBlock={validateBlock}
                                                    className="pt-1"
                                                />
                                            </SimpleBar>
                                        </div>
                                    </div>
                                    <div className="pt-5">
                                        <NextUIButton onClick={handleSubmit} color="success" className={"w-full"}>
                                            {isSaving ? <Spinner color="white" size="sm" /> : "Enviar"}
                                        </NextUIButton>
                                    </div>
                                </div>
                                <NextUIButton
                                    onClick={() => setShowPreview((preview) => !preview)}
                                    className={clsx(
                                        "fixed  md:hidden top-60 shadow-light-dark -right-3 flex gap-3 rounded-l-full px-7 py-3 z-50",
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
                            </TabPanel>
                            <TabPanel className="h-full flex flex-col">
                                <Chatbox tfgId={form.id} />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                    <div
                        className={clsx(
                            "flex-1 absolute h-full md:h-auto md:relative bg-nova-darker-2 border-1 border-l-0 border-white/10 w-full left-0 top-0 transition-transform rounded-large md:rounded-r-xl md:rounded-l-none md:translate-x-0 shadow-dark overflow-hidden",
                            showPreview ? "translate-x-0 " : "translate-x-[105%]",
                            "z-20"
                        )}>
                        <SimpleBarAbs className="bg-grid">
                            <TFG_Details TFG={TFG} />
                        </SimpleBarAbs>
                    </div>
                </div>
            )}
        </>
    );
}
