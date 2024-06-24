"use client";

import { montserrat } from "@/app/lib/fonts";
import { MessageError, ProjectFormData, college, department, iFullTFG, user } from "@/app/types/interfaces";
import { blobToBase64, isNullOrEmpty, toFirstLetterUppercase } from "@/app/utils/util";
import { Input } from "@nextui-org/input";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Textarea } from "@nextui-org/input";
import { Select, SelectItem, SelectedItems } from "@nextui-org/select";
import BasicInfo from "@/app/components/TFG/BasicInfo";
import TFG_Details from "@/app/components/TFG/TFG_Details";
import { Autocomplete, AutocompleteSection, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from "@headlessui/react";
import { IconCheck, IconChevronDown, IconCloudUpload, IconUpload, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import ImageDrop from "@/app/components/ImageDrop";
import { Spinner } from "@nextui-org/spinner";
import { DEF_BANNER } from "@/app/types/defaultData";
import { loadImageFromIndexedDB, saveImageToIndexedDB } from "@/app/lib/indexedDBHelper";

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
    const [form, setForm] = useState<ProjectFormData>({
        thumbnail: "",
        banner: DEF_BANNER,
        title: "",
        description: "",
        departmentId: departments.length > 0 ? departments[0].id : undefined,
        departmentName: departments.length > 0 ? departments[0].name : undefined,
        departmentlink: departments.length > 0 ? departments[0].link : undefined,
        tutor: [],
        content: "",
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
        college: {
            id: college.id,
            name: college.name,
            image: college.image,
        },
    };

    useEffect(() => {
        const tfgSavedData = localStorage.getItem("tfg-data");
        let data: Partial<ProjectFormData> | null = null;
        let banner: string;

        const loadInitialForm = (data: Partial<ProjectFormData> | null) => {
            if (data)
                setForm((current) => ({
                    ...current,
                    title: data.title ?? "",
                    banner: data.banner ?? DEF_BANNER,
                    description: data.description ?? "",
                    departmentId: data.departmentId && 1,
                    departmentName: data.departmentName ?? "",
                    departmentlink: data.departmentlink ?? "",
                    tutor: data.tutor ?? [],
                    content: data.content ?? "",
                    documentLink: data.documentLink ?? "",
                    tags: data.tags ?? [],
                }));
        };

        if (tfgSavedData) {
            try {
                data = JSON.parse(tfgSavedData);
            } catch (e) {
                localStorage.removeItem("tfg-data");
            }

            loadImageFromIndexedDB("banner")
                .then((blob) => {
                    if (blob) {
                        blobToBase64(blob).then((base64) => {
                            if (!data) data = {};
                            data.banner = base64;
                            loadInitialForm(data);
                        });
                        setBannerFile(new File([blob], "banner.png", { type: blob.type }));
                    }
                })
                .catch((error) => {
                    console.error("Failed to load image from IndexedDB:", error);
                });

            loadInitialForm(data);
        }
        setIsMounted(true);
    }, []);

    const handleSubmit = () => {
        if (!bannerFile) return;
        const formData = new FormData();
        formData.append("banner", bannerFile);

        const extraData = {
            name: "Shifty",
            id: 3,
            collegeId: 3,
        };

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

    const updateForm = (data: Partial<ProjectFormData>, saveToLocalStorage: boolean = true) => {
        const newData = { ...form, ...data, tutor: data.tutor ? data.tutor.map((t) => ({ ...t })) : form.tutor.map((t) => ({ ...t })) };
        setForm(newData);
        if (saveToLocalStorage) {
            localStorage.setItem("tfg-data", JSON.stringify(newData));
        }
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
        <div className="flex ">
            <div className="p-3 bg-gray-900 rounded-l-xl border-1 border-white/5 md:w-[350px] xl:w-[450px]">
                <div className="leading-4">
                    <span className="text-tiny text-gray-400">
                        Tus cambios se guardarán en este navegador <span className="font-bold">hasta que los envíes</span>. Si cambias de navegador o
                        dispositivo, no estarán disponibles
                    </span>
                </div>

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
                                    {form.tutor.length > 0 ? `(${form.tutor.length} seleccionado${form.tutor.length > 1 ? "s" : ""})` : ""}
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
                                        "w-[var(--input-width)] rounded-xl border border-white/5 bg-black/35  backdrop-blur-md p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
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
                                        className={"p-2 transition-colors hover:bg-white/10 bg-black/30 rounded-lg flex gap-2 items-center"}
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
                    aspectRatio="aspect-wide"
                    label="Banner"
                    setFile={setBannerFile}
                    updateForm={updateForm}
                    defImage={form.banner}
                />
            </div>
            <div className="flex-1 bg-grid">
                <TFG_Details TFG={TFG} />
            </div>
        </div>
    );
}
