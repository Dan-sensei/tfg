"use client";
import { useState } from "react";
import Autocomplete from "../components/Autocomplete";
import { Titulation, TitulationWithTFGCount } from "../types/interfaces";
import clsx from "clsx";
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Input, Label } from "@headlessui/react";
import { Button as NextUIButon } from "@nextui-org/button";
import { BasicButton, DangerButton, HeadlessComplete } from "../lib/headlessUIStyle";
import { produce } from "immer";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "@nextui-org/spinner";
import { IconSchoolOff } from "@tabler/icons-react";
import { isNullOrEmpty } from "../utils/util";

type Props = {
    className?: string;
    titulations: TitulationWithTFGCount[];
};

export default function TitulationsForm({ titulations, className }: Props) {
    const [titulationsList, setTitulationsList] = useState<TitulationWithTFGCount[]>(titulations);
    const [selectedTitulation, setSelectedTitulation] = useState<TitulationWithTFGCount | null>(null);
    const [fallbackTitulation, setFallbackTitulation] = useState<TitulationWithTFGCount | null>(null);
    const [newTitulationName, setNewTitulationName] = useState("");
    const [isUpdating, setIsUpdating] = useState({
        saving: false,
        deleting: false,
    });

    let [isOpen, setIsOpen] = useState(false);

    const openDeleteDialog = () => {
        if (titulationsList.length > 1 && selectedTitulation) {
            setIsOpen(true);
            const defReplace = titulationsList.filter((titulation) => titulation.id !== selectedTitulation.id)[0];
            setFallbackTitulation(defReplace);
        }
    };
    const closeDeleteDialog = () => setIsOpen(false);

    const saveTitulation = () => {
        if (!newTitulationName || selectedTitulation?.name === newTitulationName) return;

        let request: any = {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        };
        if (selectedTitulation) {
            (request.method = "PUT"),
                (request.body = JSON.stringify({
                    newTitulationName: newTitulationName,
                    TitulationId: selectedTitulation.id,
                }));
        } else {
            (request.method = "POST"),
                (request.body = JSON.stringify({
                    newTitulationName: newTitulationName,
                }));
        }

        setIsUpdating((prev) => ({ ...prev, saving: true }));
        fetch("/api/dashboard/titulation", request)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const Titulation = data.response;
                    setTitulationsList(
                        produce((draft) => {
                            const target = draft.find((c) => c.id === Titulation.id);
                            if (target) {
                                target.name = Titulation.name;
                            } else {
                                draft.push(Titulation);
                            }
                        })
                    );
                    setSelectedTitulation(Titulation);
                    toast.success("Categoría guardada");
                } else {
                    toast.error(data.response);
                }
            })
            .catch((err) => {
                toast.error(err);
                console.error(err);
            })
            .finally(() => setIsUpdating((prev) => ({ ...prev, saving: false })));
    };

    const deleteTitulation = () => {
        if (!selectedTitulation || !fallbackTitulation || titulationsList.length <= 1) return;
        setIsUpdating((prev) => ({ ...prev, deleting: true }));

        fetch("/api/dashboard/titulation", {
            method: "DELETE",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                TitulationId: selectedTitulation.id,
                fallbackTitulationId: fallbackTitulation.id,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const newList = produce(titulationsList, (draft) => {
                        const _deletedTitulation = draft.find((c) => c.id === selectedTitulation.id);
                        const _fallbackTitulation = draft.find((c) => c.id === fallbackTitulation.id);
                        if (_deletedTitulation && _fallbackTitulation) {
                            _fallbackTitulation.totalProjects += _deletedTitulation.totalProjects;
                        }
                        const index = draft.findIndex((Titulation) => Titulation.id === selectedTitulation.id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    });
                    setTitulationsList(newList);
                    setSelectedTitulation(newList[0]);
                    setNewTitulationName(newList[0].name);
                    toast.success("Categoría eliminada");
                } else {
                    toast.error(data.response);
                }
            })
            .catch((err) => {
                toast.error(err);
                console.error(err);
            })
            .finally(() => setIsUpdating((prev) => ({ ...prev, deleting: false })));
    };

    return (
        <>
            <div className={clsx(className)}>
                <Autocomplete
                    data={titulationsList}
                    value={selectedTitulation}
                    placeholder="Buscar..."
                    onChange={(value) => {
                        setNewTitulationName(value ? value.name : "");
                        setSelectedTitulation(value);
                    }}
                    optionsDisplay={(value: Titulation) => (
                        <div className="flex items-center justify-between w-full">
                            {value.name}
                            <Button className=" rounded-full border-1 border-white/15 px-3 py-1 text-tiny">Editar</Button>
                        </div>
                    )}
                    displayValue={(Titulation: Titulation | null) => (Titulation ? Titulation.name : "")}
                    defaultValue={<div className="text-sm/6 text-default-600">(Nueva titulación)</div>}
                    label=""
                />
                <div className="mt-4 text-sm mb-1">
                    {selectedTitulation && (
                        <>
                            Número de proyectos en esta titulación: <span>{selectedTitulation?.totalProjects}</span>
                        </>
                    )}
                </div>
                <section className=" border-1 border-white/5 bg-black/30 rounded-lg p-3">
                    {selectedTitulation ? (
                        <div className="flex justify-between">
                            Editar titulación <span className="text-tiny text-gray-400">ID: {selectedTitulation.id}</span>
                        </div>
                    ) : (
                        <div>Nueva titulación</div>
                    )}
                    <Field>
                        <Label className={"text-tiny "}>Nombre</Label>
                        <Input
                            onChange={(e) => setNewTitulationName(e.target.value)}
                            value={newTitulationName}
                            placeholder=""
                            className={clsx(HeadlessComplete, "rounded-lg")}
                        />
                    </Field>
                    <div className="flex justify-end gap-1 mt-3">
                        <NextUIButon
                            onClick={saveTitulation}
                            className={clsx(BasicButton, isNullOrEmpty(newTitulationName) || newTitulationName === selectedTitulation?.name && "opacity-50 pointer-events-none")}
                            variant="flat">
                            {isUpdating.saving ? <Spinner size="sm" color="white" /> : "Guardar"}
                        </NextUIButon>
                        {selectedTitulation && (
                            <NextUIButon className={clsx(BasicButton, DangerButton, titulationsList.length <= 1 && "opacity-50 pointer-events-none")} variant="flat" onClick={openDeleteDialog}>
                                {isUpdating.deleting ? <Spinner size="sm" color="white" /> : "Borrar"}
                            </NextUIButon>
                        )}
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
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-2xl rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
                            <div className="text-center flex flex-col items-center">
                                <IconSchoolOff size={100} className="opacity-50 mb-2" />
                                <p>
                                    Estás a punto de eliminar la titulación "
                                    <span className="text-nova-error font-semibold">{selectedTitulation?.name}</span>"{" "}
                                    {selectedTitulation && selectedTitulation.totalProjects > 0 && "que contiene"}{" "}
                                </p>
                                {selectedTitulation && selectedTitulation.totalProjects > 0 && (
                                    <>
                                        <p className="py-1">
                                            <span className="font-semibold text-nova-error text-xl">{selectedTitulation?.totalProjects} proyectos</span>
                                        </p>

                                        <p className="pt-1">Por favor, selecciona otra titulación para reasignarlos.</p>
                                        <div className=" flex justify-center w-full">
                                            <Autocomplete
                                                required
                                                className="max-w-full w-96"
                                                data={titulationsList.filter((Titulation) => Titulation.id !== selectedTitulation?.id)}
                                                value={fallbackTitulation}
                                                placeholder="Buscar..."
                                                onChange={(value) => {
                                                    setFallbackTitulation(value);
                                                }}
                                                optionsDisplay={(value: Titulation) => (
                                                    <div className="flex items-center justify-between w-full">
                                                        {value.name}
                                                        <Button className=" rounded-full border-1 border-white/15 px-3 py-1 text-tiny">Editar</Button>
                                                    </div>
                                                )}
                                                displayValue={(Titulation: Titulation | null) => (Titulation ? Titulation.name : "")}
                                                defaultValue={<div className="text-sm/6 text-default-600">(Nueva titulación)</div>}
                                                label="Categoria"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="mt-4 flex justify-center">
                                <NextUIButon
                                    className={clsx(BasicButton, DangerButton)}
                                    onClick={() => {
                                        closeDeleteDialog();
                                        deleteTitulation();
                                    }}>
                                    Borrar
                                </NextUIButon>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
