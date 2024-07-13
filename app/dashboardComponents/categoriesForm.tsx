"use client";
import { useEffect, useState } from "react";
import Autocomplete from "../components/Autocomplete";
import { Category, CategoryWithTFGCount } from "../types/interfaces";
import clsx from "clsx";
import { Button, Dialog, DialogBackdrop, DialogPanel, Field, Input, Label } from "@headlessui/react";
import { BasicButton, DangerButton, HeadlessComplete } from "../lib/headlessUIStyle";
import { produce } from "immer";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "@nextui-org/spinner";
import { IconCategoryMinus } from "@tabler/icons-react";
import { isNullOrEmpty } from "../utils/util";
import { useDashboard } from "../contexts/DashboardContext";

type Props = {
    className?: string;
};

export default function CategoriesForm({ className }: Props) {
    const [categoriesList, setCategoriesList] = useState<CategoryWithTFGCount[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithTFGCount | null>(null);
    const [fallbackCategory, setFallbackCategory] = useState<CategoryWithTFGCount | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isUpdating, setIsUpdating] = useState({
        saving: false,
        deleting: false,
    });
    const [isFetching, setIsFetching] = useState(true);

    let [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsFetching(true);
        fetch("/api/dashboard/category", {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setCategoriesList(data.response);
                } else {
                    toast.error("Error fetching categories");
                }
            })
            .catch((err) => {
                toast.error(err.message);
            })
            .finally(() => setIsFetching(false));
    }, []);

    const openDeleteDialog = () => {
        if (categoriesList.length > 1 && selectedCategory) {
            setIsOpen(true);
            const defReplace = categoriesList.filter((category) => category.id !== selectedCategory.id)[0];
            setFallbackCategory(defReplace);
        }
    };
    const closeDeleteDialog = () => setIsOpen(false);

    const saveCategory = () => {
        if (!newCategoryName || selectedCategory?.name === newCategoryName) return;

        setIsUpdating((prev) => ({ ...prev, saving: true }));
        fetch("/api/dashboard/category", {
            method: selectedCategory ? "PUT" : "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newCategoryName: newCategoryName,
                ...(selectedCategory && { categoryId: selectedCategory.id }),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const category = { ...data.response, totalProjects: 0 };
                    setCategoriesList(
                        produce((draft) => {
                            const target = draft.find((c) => c.id === category.id);
                            if (target) {
                                target.name = category.name;
                            } else {
                                draft.push(category);
                            }
                        })
                    );
                    setSelectedCategory(category);
                    toast.success("Categoría guardada");
                } else {
                    toast.error(data.response);
                }
            })
            .catch((err) => {
                toast.error("Se ha producido un error inesperado");
                console.error(err);
            })
            .finally(() => setIsUpdating((prev) => ({ ...prev, saving: false })));
    };

    const deleteCategory = () => {
        if (!selectedCategory || !fallbackCategory || categoriesList.length <= 1) return;
        setIsUpdating((prev) => ({ ...prev, deleting: true }));

        fetch("/api/dashboard/category", {
            method: "DELETE",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                deleteData: {
                    targetId: selectedCategory.id,
                    fallbackId: fallbackCategory.id,
                },
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const newList = produce(categoriesList, (draft) => {
                        const _deletedCategory = draft.find((c) => c.id === selectedCategory.id);
                        const _fallbackCategory = draft.find((c) => c.id === fallbackCategory.id);
                        if (_deletedCategory && _fallbackCategory) {
                            _fallbackCategory.totalProjects += _deletedCategory.totalProjects;
                        }
                        const index = draft.findIndex((category) => category.id === selectedCategory.id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    });
                    setCategoriesList(newList);
                    setSelectedCategory(newList[0]);
                    setNewCategoryName(newList[0].name);
                    toast.success("Categoría eliminada");
                } else {
                    toast.error(data.response);
                }
            })
            .catch((err) => {
                toast.error("Se ha producido un error inesperado");
                console.error(err);
            })
            .finally(() => setIsUpdating((prev) => ({ ...prev, deleting: false })));
    };

    return (
        <>
            <div className={clsx(className, isFetching && "opacity-50 pointer-events-none")}>
                {isFetching && <Spinner color="white" className="absolute top-3 right-3 " />}
                <Autocomplete
                    data={categoriesList}
                    value={selectedCategory}
                    placeholder="Buscar..."
                    onChange={(value) => {
                        setNewCategoryName(value ? value.name : "");
                        setSelectedCategory(value);
                    }}
                    optionsDisplay={(value: Category) => (
                        <div className="flex items-center justify-between w-full">
                            {value.name}
                            <Button className=" rounded-full border-1 border-white/15 px-3 py-1 text-tiny">Editar</Button>
                        </div>
                    )}
                    displayValue={(category: Category | null) => (category ? category.name : "")}
                    defaultValue={<div className="text-sm/6 text-default-600">(Nueva categoria)</div>}
                    label=""
                />
                <div className="mt-4 text-sm mb-1">
                    {selectedCategory && (
                        <>
                            Número de proyectos en esta categoría: <span>{selectedCategory?.totalProjects}</span>
                        </>
                    )}
                </div>
                <section className=" border-1 border-white/5 bg-black/30 rounded-lg p-3">
                    {selectedCategory ? (
                        <div className="flex justify-between">
                            Editar categoría <span className="text-tiny text-gray-400">ID: {selectedCategory.id}</span>
                        </div>
                    ) : (
                        <div>Nueva categoría</div>
                    )}
                    <Field>
                        <Label className={"text-tiny "}>Nombre</Label>
                        <Input
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            value={newCategoryName}
                            placeholder=""
                            className={clsx(HeadlessComplete, "rounded-lg")}
                        />
                    </Field>
                    <div className="flex justify-end gap-1 mt-3">
                        {selectedCategory && (
                            <Button
                                className={clsx(
                                    BasicButton,
                                    DangerButton,
                                    "rounded-md",
                                    categoriesList.length <= 1 && "opacity-50 pointer-events-none"
                                )}
                                onClick={openDeleteDialog}>
                                {isUpdating.deleting ? <Spinner size="sm" color="white" /> : "Borrar"}
                            </Button>
                        )}
                        <Button
                            onClick={saveCategory}
                            className={clsx(
                                BasicButton,
                                "rounded-md",
                                (isNullOrEmpty(newCategoryName) || newCategoryName === selectedCategory?.name) && "opacity-50 pointer-events-none"
                            )}>
                            {isUpdating.saving ? <Spinner size="sm" color="white" /> : "Guardar"}
                        </Button>
                    </div>
                </section>
                <Toaster
                    toastOptions={{
                        className: "border-white/10 border-1 ",
                        style: {
                            borderRadius: "10px",
                            background: "#1a1a1a",
                            color: "#fff",
                        },
                    }}
                />
            </div>
            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeDeleteDialog}>
                <DialogBackdrop className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-2xl rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
                            <div className="text-center flex flex-col items-center">
                                <IconCategoryMinus size={100} className="opacity-50 mb-2" />
                                <p>
                                    Estás a punto de eliminar la categoría &quot;
                                    <span className="text-nova-error font-semibold">{selectedCategory?.name}</span>&quot;{" "}
                                    {selectedCategory && selectedCategory.totalProjects > 0 && "que contiene"}{" "}
                                </p>
                                {selectedCategory && selectedCategory.totalProjects > 0 && (
                                    <>
                                        <p className="py-1">
                                            <span className="font-semibold text-nova-error text-xl">{selectedCategory?.totalProjects} proyectos</span>
                                        </p>

                                        <p className="pt-1">Por favor, selecciona otra categoría para reasignarlos.</p>
                                        <div className=" flex justify-center w-full">
                                            <Autocomplete
                                                required
                                                className="max-w-full w-96"
                                                data={categoriesList.filter((category) => category.id !== selectedCategory?.id)}
                                                value={fallbackCategory}
                                                placeholder="Buscar..."
                                                onChange={(value) => {
                                                    setFallbackCategory(value);
                                                }}
                                                optionsDisplay={(value: Category) => (
                                                    <div className="flex items-center justify-between w-full">
                                                        {value.name}
                                                        <Button className=" rounded-full border-1 border-white/15 px-3 py-1 text-tiny">Editar</Button>
                                                    </div>
                                                )}
                                                displayValue={(category: Category | null) => (category ? category.name : "")}
                                                defaultValue={<div className="text-sm/6 text-default-600">(Nueva categoria)</div>}
                                                label="Categoria"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="mt-4 flex justify-center">
                                <Button
                                    className={clsx(BasicButton, DangerButton)}
                                    onClick={() => {
                                        closeDeleteDialog();
                                        deleteCategory();
                                    }}>
                                    Borrar
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
