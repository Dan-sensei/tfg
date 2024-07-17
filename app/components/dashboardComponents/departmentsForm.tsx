"use client";
import { useEffect, useState } from "react";
import Autocomplete from "../Autocomplete";
import { Department, DepartmentWithTFGCount, FullDepartment } from "../../types/interfaces";
import clsx from "clsx";
import { Button, Dialog, DialogBackdrop, DialogPanel, Field, Input, Label } from "@headlessui/react";
import { Button as NextUIButon } from "@nextui-org/button";
import { BasicButton, DangerButton, HeadlessComplete } from "../../lib/headlessUIStyle";
import { produce } from "immer";
import { Spinner } from "@nextui-org/spinner";
import { IconMicroscope } from "@tabler/icons-react";
import { isNullOrEmpty } from "../../utils/util";
import { useDashboard } from "../../contexts/DashboardContext";
import { useToast } from "@/app/contexts/ToasterContext";

type Props = {
    className?: string;
};

const compareNullableStrings = (str1: string | null | undefined, str2: string | null | undefined) => {
    if (!str1 && !str2) return true;

    return str1 === str2;
};

export default function DepartmentsForm({ className }: Props) {
    const [departmentsList, setDepartmentsList] = useState<DepartmentWithTFGCount[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentWithTFGCount | null>(null);
    const [fallbackDepartment, setFallbackDepartment] = useState<DepartmentWithTFGCount | null>(null);
    const [newDepartmentData, setNewDepartmentData] = useState({
        name: "",
        link: "",
    });
    const [isUpdating, setIsUpdating] = useState({
        saving: false,
        deleting: false,
    });
    const { collegeId, isInitialized } = useDashboard();
    const [isFetching, setIsFetching] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if(!isInitialized) return;
        setIsFetching(true);
        fetch(`/api/dashboard/department?collegeId=${collegeId}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                if (data.success) {
                    setDepartmentsList(data.response);
                    setSelectedDepartment(data.response[0] ?? null);
                    setNewDepartmentData({ name: data.response[0]?.name ?? "", link: data.response[0]?.link ?? "" });
                } else toast.error(data.response);
            })
            .catch((err) => toast.error(err.message))
            .finally(() => setIsFetching(false));
    }, [collegeId, isInitialized]);

    const canSave =
        !isNullOrEmpty(newDepartmentData.name) &&
        !(
            compareNullableStrings(newDepartmentData.name, selectedDepartment?.name) &&
            compareNullableStrings(newDepartmentData.link, selectedDepartment?.link)
        );

    let [isOpen, setIsOpen] = useState(false);

    const openDeleteDialog = () => {
        if (selectedDepartment) {
            setIsOpen(true);
            const defReplace = departmentsList.filter((department) => department.id !== selectedDepartment.id)[0];
            setFallbackDepartment(defReplace);
        }
    };
    const closeDeleteDialog = () => setIsOpen(false);
    
    const saveDepartment = () => {
        if (!canSave) return;

        setIsUpdating((prev) => ({ ...prev, saving: true }));
        fetch("/api/dashboard/department", {
            method: selectedDepartment ? "PUT" : "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collegeId,
                newDepartmentName: newDepartmentData.name,
                newDepartmentLink: isNullOrEmpty(newDepartmentData.link) ? null : newDepartmentData.link,
                ...(selectedDepartment && { departmentId: selectedDepartment.id }),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log(data)

                    const department = { ...data.response, totalProjects: 0 };
                    setDepartmentsList(
                        produce((draft) => {
                            const target = draft.find((c) => c.id === department.id);
                            if (target) {
                                target.name = department.name;
                            } else {
                                draft.push(department);
                            }
                        })
                    );
                    setSelectedDepartment(department);
                    toast.success("Departamento guardado");
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

    const deleteDepartment = () => {
        if (!selectedDepartment) return;
        setIsUpdating((prev) => ({ ...prev, deleting: true }));

        fetch("/api/dashboard/department", {
            method: "DELETE",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collegeId,
                deleteData: {
                    targetId: selectedDepartment.id,
                    fallbackId: fallbackDepartment ? fallbackDepartment.id : null,
                },
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const newList = produce(departmentsList, (draft) => {
                        if (fallbackDepartment) {
                            const _deletedDepartment = draft.find((c) => c.id === selectedDepartment.id);
                            const _fallbackDepartment = draft.find((c) => c.id === fallbackDepartment.id);
                            if (_deletedDepartment && _fallbackDepartment) {
                                _fallbackDepartment.totalProjects += _deletedDepartment.totalProjects;
                            }
                        }
                        // Remove the deleted department from the list
                        const index = draft.findIndex((department) => department.id === selectedDepartment.id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    });
                    console.log(newList)
                    setDepartmentsList(newList);
                    setSelectedDepartment(newList[0] ?? null);
                    setNewDepartmentData({ name: newList[0]?.name ?? "", link: newList[0]?.link ?? "" });
                    toast.success("Departamento eliminado");
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
                    data={departmentsList}
                    value={selectedDepartment}
                    placeholder="Buscar..."
                    onChange={(value) => {
                        setNewDepartmentData({ name: value ? value.name : "", link: value?.link ?? "" });
                        setSelectedDepartment(value);
                    }}
                    optionsDisplay={(value: FullDepartment) => (
                        <div className="flex items-center justify-between w-full">
                            {value.name}
                            <Button className=" rounded-full border-1 border-white/15 px-3 py-1 text-tiny">Editar</Button>
                        </div>
                    )}
                    displayValue={(department: FullDepartment | null) => (department ? department.name : "")}
                    defaultValue={<div className="text-sm/6 text-default-600">(Nueva departamento)</div>}
                    label=""
                />
                <div className="mt-4 text-sm mb-1">
                    {selectedDepartment && (
                        <>
                            Número de proyectos en esta departamento: <span>{selectedDepartment?.totalProjects}</span>
                        </>
                    )}
                </div>
                <section className=" border-1 border-white/5 bg-black/30 rounded-lg p-3">
                    {selectedDepartment ? (
                        <div className="flex justify-between">
                            Editar departamento <span className="text-tiny text-gray-400">ID: {selectedDepartment.id}</span>
                        </div>
                    ) : (
                        <div>Nueva departamento</div>
                    )}
                    <Field>
                        <Label className={"text-tiny "}>Nombre</Label>
                        <Input
                            onChange={(e) =>
                                setNewDepartmentData(
                                    produce((draft) => {
                                        draft.name = e.target.value;
                                    })
                                )
                            }
                            value={newDepartmentData.name}
                            placeholder=""
                            className={clsx(HeadlessComplete, "rounded-lg")}
                        />
                    </Field>
                    <Field className={"pt-2"}>
                        <Label className={"text-tiny "}>Link</Label>
                        <Input
                            onChange={(e) =>
                                setNewDepartmentData(
                                    produce((draft) => {
                                        draft.link = e.target.value;
                                    })
                                )
                            }
                            value={newDepartmentData.link}
                            placeholder="https://..."
                            className={clsx(HeadlessComplete, "rounded-lg")}
                        />
                    </Field>
                    <div className="flex justify-end gap-1 mt-3">
                        {selectedDepartment && (
                            <NextUIButon
                                className={clsx(
                                    BasicButton,
                                    DangerButton,
                                    "rounded-md"
                                )}
                                variant="flat"
                                onClick={openDeleteDialog}>
                                {isUpdating.deleting ? <Spinner size="sm" color="white" /> : "Borrar"}
                            </NextUIButon>
                        )}
                        <NextUIButon
                            onClick={saveDepartment}
                            className={clsx(BasicButton, "rounded-md", !canSave && "opacity-50 pointer-events-none")}
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
                                <IconMicroscope size={100} className="opacity-50 mb-2" />
                                <p>
                                    Estás a punto de eliminar el departamento &quot;
                                    <span className="text-nova-error font-semibold">{selectedDepartment?.name}</span>&quot;{" "}
                                    {selectedDepartment && selectedDepartment.totalProjects > 0 && "que contiene"}{" "}
                                </p>
                                {selectedDepartment && selectedDepartment.totalProjects > 0 && (
                                    <>
                                        <p className="py-1">
                                            <span className="font-semibold text-nova-error text-xl">
                                                {selectedDepartment?.totalProjects} proyectos
                                            </span>
                                        </p>

                                        <p className="pt-1">
                                            Por favor, selecciona otro departamento para reasignarlos o la opción (Ninguno) para dejarlo vacío.
                                        </p>
                                        <div className=" flex justify-center w-full">
                                            <Autocomplete
                                                className="max-w-full w-96"
                                                data={departmentsList.filter((department) => department.id !== selectedDepartment?.id)}
                                                value={fallbackDepartment}
                                                placeholder="Buscar..."
                                                onChange={(value) => {
                                                    setFallbackDepartment(value);
                                                }}
                                                optionsDisplay={(value: FullDepartment) => (
                                                    <div className="flex items-center justify-between w-full">
                                                        {value.name}
                                                        <Button className=" rounded-full border-1 border-white/15 px-3 py-1 text-tiny">Editar</Button>
                                                    </div>
                                                )}
                                                displayValue={(department: FullDepartment | null) => (department ? department.name : "")}
                                                defaultValue={<div className="text-sm/6 text-default-600">(Ninguno)</div>}
                                                label="Departamento"
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
                                        deleteDepartment();
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
