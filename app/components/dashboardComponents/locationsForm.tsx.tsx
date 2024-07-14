"use client";
import { useEffect, useState } from "react";
import Autocomplete from "../Autocomplete";
import { Location, LocationWithDefenseCount } from "../../types/interfaces";
import clsx from "clsx";
import { Button, Dialog, DialogBackdrop, DialogPanel, Field, Input, Label } from "@headlessui/react";
import { Button as NextUIButon } from "@nextui-org/button";
import { BasicButton, DangerButton, HeadlessComplete } from "../../lib/headlessUIStyle";
import { produce } from "immer";
import { Spinner } from "@nextui-org/spinner";
import { IconMapPinFilled } from "@tabler/icons-react";
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

export default function LocationsForm({ className }: Props) {
    const [locationsList, setLocationsList] = useState<LocationWithDefenseCount[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationWithDefenseCount | null>(null);
    const [fallbackLocation, setFallbackLocation] = useState<LocationWithDefenseCount | null>(null);
    const [newLocationData, setNewLocationData] = useState({
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
        fetch(`/api/dashboard/location?collegeId=${collegeId}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setLocationsList(data.response) 
                    setSelectedLocation(data.response[0] ?? null);
                    setNewLocationData({ name: data.response[0]?.name ?? "", link: data.response[0]?.link ?? "" });
                }
                else toast.error(data.response);
            })
            .catch((err) => {
                toast.error(err.message);
                console.log(err);
            })
            .finally(() => setIsFetching(false));
    }, [collegeId, isInitialized]);

    const canSave =
        !isNullOrEmpty(newLocationData.name) &&
        !(
            compareNullableStrings(newLocationData.name, selectedLocation?.name) &&
            compareNullableStrings(newLocationData.link, selectedLocation?.mapLink)
        );

    let [isOpen, setIsOpen] = useState(false);

    const openDeleteDialog = () => {
        if (selectedLocation) {
            setIsOpen(true);
            if (selectedLocation.totalDefenses > 0) {
                const defReplace = locationsList.filter((location) => location.id !== selectedLocation.id)[0];
                setFallbackLocation(defReplace);
            }
        }
    };
    const closeDeleteDialog = () => setIsOpen(false);

    const saveLocation = () => {
        if (!canSave) return;
        setIsUpdating((prev) => ({ ...prev, saving: true }));
        fetch("/api/dashboard/location", {
            method: selectedLocation ? "PUT" : "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collegeId,
                locationData: {
                    id: selectedLocation?.id ?? -1,
                    name: newLocationData.name,
                    mapLink: isNullOrEmpty(newLocationData.link) ? null : newLocationData.link,
                },
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const location = { ...data.response, totalProjects: 0 };
                    setLocationsList(
                        produce((draft) => {
                            const index = draft.findIndex((c) => c.id === location.id);
                            if (index !== -1) {
                                draft[index] = location;
                            } else {
                                draft.push(location);
                            }
                            draft.sort((a, b) => a.name.localeCompare(b.name));
                        })
                    );
                    setSelectedLocation(location);
                    toast.success("Localización guardado");
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

    const deleteLocation = () => {
        if (!selectedLocation) return;
        setIsUpdating((prev) => ({ ...prev, deleting: true }));

        fetch("/api/dashboard/location", {
            method: "DELETE",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collegeId,
                deleteData: {
                    targetId: selectedLocation.id,
                    fallbackId: fallbackLocation ? fallbackLocation.id : null,
                },
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const newList = produce(locationsList, (draft) => {
                        if (fallbackLocation) {
                            const _deletedLocation = draft.find((c) => c.id === selectedLocation.id);
                            const _fallbackLocation = draft.find((c) => c.id === fallbackLocation.id);
                            if (_deletedLocation && _fallbackLocation) {
                                _fallbackLocation.totalDefenses += _deletedLocation.totalDefenses;
                            }
                        }
                        // Remove the deleted location from the list
                        const index = draft.findIndex((location) => location.id === selectedLocation.id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    });
                    setLocationsList(newList);
                    setSelectedLocation(newList[0] ?? null);
                    setNewLocationData({ name: newList[0]?.name ?? "", link: newList[0]?.mapLink ?? "" });
                    toast.success("Localización eliminado");
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
                    data={locationsList}
                    value={selectedLocation}
                    placeholder="Buscar..."
                    onChange={(value) => {
                        setNewLocationData({ name: value?.name ?? "", link: value?.mapLink ?? "" });
                        setSelectedLocation(value);
                        setFallbackLocation(null);
                    }}
                    optionsDisplay={(value: Location) => (
                        <div className="flex items-center justify-between w-full">
                            {value.name}
                            <Button className=" rounded-full border-1 border-white/15 px-3 py-1 text-tiny">Editar</Button>
                        </div>
                    )}
                    displayValue={(location: Location | null) => (location ? location.name : "")}
                    defaultValue={<div className="text-sm/6 text-default-600">(Nueva localización)</div>}
                    label=""
                />
                <div className="mt-4 text-sm mb-1">
                    {selectedLocation && (
                        <>
                            Número de proyectos en esta localización: <span>{selectedLocation?.totalDefenses}</span>
                        </>
                    )}
                </div>
                <section className=" border-1 border-white/5 bg-black/30 rounded-lg p-3">
                    {selectedLocation ? (
                        <div className="flex justify-between">
                            Editar localización <span className="text-tiny text-gray-400">ID: {selectedLocation.id}</span>
                        </div>
                    ) : (
                        <div>Nueva localización</div>
                    )}
                    <Field>
                        <Label className={"text-tiny "}>Nombre</Label>
                        <Input
                            onChange={(e) =>
                                setNewLocationData(
                                    produce((draft) => {
                                        draft.name = e.target.value;
                                    })
                                )
                            }
                            value={newLocationData.name}
                            placeholder=""
                            className={clsx(HeadlessComplete, "rounded-lg")}
                        />
                    </Field>
                    <Field className={"pt-2"}>
                        <Label className={"text-tiny "}>Link</Label>
                        <Input
                            onChange={(e) =>
                                setNewLocationData(
                                    produce((draft) => {
                                        draft.link = e.target.value;
                                    })
                                )
                            }
                            value={newLocationData.link}
                            placeholder="https://..."
                            className={clsx(HeadlessComplete, "rounded-lg")}
                        />
                    </Field>
                    <div className="flex justify-end gap-1 mt-3">
                        {selectedLocation && (
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
                            onClick={saveLocation}
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
                                <IconMapPinFilled size={100} className="opacity-50 mb-2" />
                                <p>
                                    Estás a punto de eliminar el localización &quot;
                                    <span className="text-nova-error font-semibold">{selectedLocation?.name}</span>&quot;{" "}
                                    {selectedLocation && selectedLocation.totalDefenses > 0 && "que contiene"}{" "}
                                </p>
                                {selectedLocation && selectedLocation.totalDefenses > 0 && (
                                    <>
                                        <p className="py-1">
                                            <span className="font-semibold text-nova-error text-xl">{selectedLocation?.totalDefenses} proyectos</span>
                                        </p>

                                        <p className="pt-1">
                                            Por favor, selecciona otro localización para reasignarlos o la opción (Ninguno) para dejarlo vacío.
                                        </p>
                                        <div className=" flex justify-center w-full">
                                            <Autocomplete
                                                className="max-w-full w-96"
                                                data={locationsList.filter((location) => location.id !== selectedLocation?.id)}
                                                value={fallbackLocation}
                                                placeholder="Buscar..."
                                                onChange={(value) => {
                                                    setFallbackLocation(value);
                                                }}
                                                optionsDisplay={(value: Location) => (
                                                    <div className="flex items-center justify-between w-full">
                                                        {value.name}
                                                        <Button className=" rounded-full border-1 border-white/15 px-3 py-1 text-tiny">Editar</Button>
                                                    </div>
                                                )}
                                                displayValue={(location: Location | null) => (location ? location.name : "")}
                                                defaultValue={<div className="text-sm/6 text-default-600">(Ninguno)</div>}
                                                label="Localización"
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
                                        deleteLocation();
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
