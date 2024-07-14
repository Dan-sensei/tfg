"use client";
import { useEffect, useState } from "react";
import Autocomplete from "../Autocomplete";
import { Titulation, TitulationWithTFGCount } from "../../types/interfaces";
import clsx from "clsx";
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Input, Label } from "@headlessui/react";
import { Button as NextUIButon } from "@nextui-org/button";
import { BasicButton, DangerButton, HeadlessComplete } from "../../lib/headlessUIStyle";
import { produce } from "immer";
import { Spinner } from "@nextui-org/spinner";
import { IconSchool } from "@tabler/icons-react";
import { isNullOrEmpty } from "../../utils/util";
import { useDashboard } from "../../contexts/DashboardContext";
import { useToast } from "@/app/contexts/ToasterContext";

type Props = {
    className?: string;
};

export default function TitulationsForm({ className }: Props) {
    const [titulationsList, setTitulationsList] = useState<TitulationWithTFGCount[]>([]);
    const [selectedTitulation, setSelectedTitulation] = useState<TitulationWithTFGCount | null>(null);
    const [fallbackTitulation, setFallbackTitulation] = useState<TitulationWithTFGCount | null>(null);
    const [newTitulationName, setNewTitulationName] = useState("");
    const [isUpdating, setIsUpdating] = useState({
        saving: false,
        deleting: false,
    });
    const { collegeId, isInitialized } = useDashboard();
    const [isFetching, setIsFetching] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!isInitialized) return;
        setIsFetching(true);
        fetch(`/api/dashboard/titulation?collegeId=${collegeId}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setTitulationsList(data.response);
                    setSelectedTitulation(data.response[0] ?? null);
                    setNewTitulationName(data.response[0]?.name ?? "");
                } else toast.error(data.response);
            })
            .catch((err) => toast.error(err.message))
            .finally(() => setIsFetching(false));
    }, [collegeId, isInitialized]);

    let [isOpen, setIsOpen] = useState(false);

    const openDeleteDialog = () => {
        if (selectedTitulation) {
            setIsOpen(true);
            const defReplace = titulationsList.filter((titulation) => titulation.id !== selectedTitulation.id)[0];
            setFallbackTitulation(defReplace);
        }
    };
    const closeDeleteDialog = () => setIsOpen(false);

    const saveTitulation = () => {
        if (!newTitulationName || selectedTitulation?.name === newTitulationName) return;

        setIsUpdating((prev) => ({ ...prev, saving: true }));
        fetch("/api/dashboard/titulation", {
            method: selectedTitulation ? "PUT" : "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collegeId,
                newTitulationName: newTitulationName,
                ...(selectedTitulation && { titulationId: selectedTitulation.id }),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const titulation = { ...data.response, totalProjects: 0 };
                    setTitulationsList(
                        produce((draft) => {
                            const target = draft.find((c) => c.id === titulation.id);
                            if (target) {
                                target.name = titulation.name;
                            } else {
                                draft.push(titulation);
                            }
                        })
                    );
                    setSelectedTitulation(titulation);
                    toast.success("Titulación guardada");
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

    const deleteTitulation = () => {
        if (!selectedTitulation) return;
        setIsUpdating((prev) => ({ ...prev, deleting: true }));

        fetch("/api/dashboard/titulation", {
            method: "DELETE",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collegeId,
                deleteData: {
                    targetId: selectedTitulation.id,
                    fallbackId: fallbackTitulation ? fallbackTitulation.id : null,
                },
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const newList = produce(titulationsList, (draft) => {
                        if (fallbackTitulation) {
                            const _deletedTitulation = draft.find((c) => c.id === selectedTitulation.id);
                            const _fallbackTitulation = draft.find((c) => c.id === fallbackTitulation.id);
                            if (_deletedTitulation && _fallbackTitulation) {
                                _fallbackTitulation.totalProjects += _deletedTitulation.totalProjects;
                            }
                        }
                        const index = draft.findIndex((titulation) => titulation.id === selectedTitulation.id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    });
                    setTitulationsList(newList);
                    setSelectedTitulation(newList[0] ?? null);
                    setNewTitulationName(newList[0]?.name ?? "");
                    toast.success("Titulación eliminada");
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
                    displayValue={(titulation: Titulation | null) => (titulation ? titulation.name : "")}
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
                        {selectedTitulation && (
                            <NextUIButon className={clsx(BasicButton, DangerButton, "rounded-md")} variant="flat" onClick={openDeleteDialog}>
                                {isUpdating.deleting ? <Spinner size="sm" color="white" /> : "Borrar"}
                            </NextUIButon>
                        )}
                        <NextUIButon
                            onClick={saveTitulation}
                            className={clsx(
                                BasicButton,
                                "rounded-md",
                                (isNullOrEmpty(newTitulationName) || newTitulationName === selectedTitulation?.name) &&
                                    "opacity-50 pointer-events-none"
                            )}
                            variant="flat">
                            {isUpdating.saving ? <Spinner size="sm" color="white" /> : "Guardar"}
                        </NextUIButon>
                    </div>
                </section>
            </div>
            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeDeleteDialog}>
                <DialogBackdrop className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-2xl rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
                            <div className="text-center flex flex-col items-center">
                                <IconSchool size={100} className="opacity-50 mb-2" />
                                <p>
                                    Estás a punto de eliminar la titulación &quot;
                                    <span className="text-nova-error font-semibold">{selectedTitulation?.name}</span>&quot;{" "}
                                    {selectedTitulation && selectedTitulation.totalProjects > 0 && "que contiene"}{" "}
                                </p>
                                {selectedTitulation && selectedTitulation.totalProjects > 0 && (
                                    <>
                                        <p className="py-1">
                                            <span className="font-semibold text-nova-error text-xl">
                                                {selectedTitulation?.totalProjects} proyectos
                                            </span>
                                        </p>

                                        <p className="pt-1">Por favor, selecciona otra titulación para reasignarlos.</p>
                                        <div className=" flex justify-center w-full">
                                            <Autocomplete
                                                required
                                                className="max-w-full w-96"
                                                data={titulationsList.filter((titulation) => titulation.id !== selectedTitulation?.id)}
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
                                                displayValue={(titulation: Titulation | null) => (titulation ? titulation.name : "")}
                                                defaultValue={<div className="text-sm/6 text-default-600">(Nueva titulación)</div>}
                                                label="Titulación"
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
