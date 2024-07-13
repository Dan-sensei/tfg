"use client";

import SimpleBarAbs from "@/app/components/SimpleBarAbs";
import DefenseButton from "@/app/dashboardComponents/defenseButton";
import { BasicButton, DangerButton, HeadlessBasic, HeadlessComplete, InfoButton, PrimaryButton, SuccessButton } from "@/app/lib/headlessUIStyle";
import { DefenseData, Location } from "@/app/types/interfaces";
import {
    Button,
    Description,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Field,
    Input,
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { format, set } from "date-fns";
import { es } from "date-fns/locale";
import { TimeInput } from "@nextui-org/date-input";
import { DatePicker } from "@nextui-org/date-picker";
import { Time, parseZonedDateTime, parseAbsoluteToLocal, parseAbsolute, getLocalTimeZone, ZonedDateTime } from "@internationalized/date";
import { original, produce } from "immer";
import { IconCalendarMinus, IconCalendarPlus, IconCheck, IconChevronDown, IconClock, IconPlus } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import Autocomplete from "@/app/components/Autocomplete";
import { CharacterCounter, Required } from "@/app/components/BasicComponents";
import { Spinner } from "@nextui-org/spinner";
import { Divider } from "@nextui-org/divider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MAX_DEFENSE_TITLE_LENGTH } from "@/app/types/defaultData";
import * as v from "valibot";
import { DefenseDataSchema } from "@/app/lib/schemas";
import { useDashboard } from "@/app/contexts/DashboardContext";

type Props = {
    className?: string;
    year: number;
    month: number;
};

type datesType = {
    start: ZonedDateTime;
    end: ZonedDateTime;
};

const months: { [key: number]: string } = {
    1: "Enero",
    2: "Febrero",
    3: "Marzo",
    4: "Abril",
    5: "Mayo",
    6: "Junio",
    7: "Julio",
    8: "Agosto",
    9: "Septiembre",
    10: "Octubre",
    11: "Noviembre",
    12: "Diciembre",
};
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear + 3 - 2024 }, (v, i) => 2023 + i);

export default function DefenseList({ className, year, month }: Props) {
    const [defenseList, setDefenseList] = useState<DefenseData[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedDefense, setSelectedDefense] = useState<DefenseData | null>(null);
    const { collegeId } = useDashboard();
    const [isUpdating, setIsUpdating] = useState({
        saving: false,
        deleting: false,
    });
    const [errorMessages, setErroMessages] = useState({ title: "", locationName: "" });
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const [isFetching, setIsFetching] = useState(true);

    const [dates, setDates] = useState<datesType>({
        start: parseAbsoluteToLocal(new Date().toISOString()),
        end: parseAbsoluteToLocal(new Date().toISOString()),
    });

    let [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const updateDefense = (data: Partial<DefenseData>) => {
        setSelectedDefense(
            produce((draft) => {
                if (draft) Object.assign(draft, data);
            })
        );
    };

    useEffect(() => {
        fetch(`/api/dashboard/location?collegeId=${collegeId}`, {
            method: "GET",
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setLocations(data.response);
                }
            })
            .catch((err) => {
                toast.error("Error la lista de localizaciones");
                console.error(err);
            });
    }, [collegeId]);

    useEffect(() => {
        setIsFetching(true);
        const params = new URLSearchParams(searchParams);
        params.set("collegeId", collegeId.toString());
        fetch(`/api/dashboard/defense?${params.toString()}`, {
            method: "GET",
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const loadedDefenses = data.response.map((defense: DefenseData) => ({
                        ...defense,
                        startTime: new Date(defense.startTime),
                        endTime: new Date(defense.endTime),
                    }));
                    setDefenseList(loadedDefenses);
                }
            })
            .catch((err) => {
                toast.error("Error al cargar los datos de las defensas");
                console.error(err);
            })
            .finally(() => setIsFetching(false));
    }, [searchParams, collegeId]);

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const saveDefense = () => {
        if (!selectedDefense || isUpdating.saving) return;
        setIsUpdating((prev) => ({ ...prev, saving: true }));
        fetch("/api/dashboard/defense", {
            method: selectedDefense.id < 0 ? "POST" : "PUT",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                defenseData: { ...selectedDefense, startTime: dates.start.toAbsoluteString(), endTime: dates.end.toAbsoluteString() },
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    toast.success("Defensa guardada correctamente");
                    const newDefense: DefenseData = {
                        ...data.response,
                        startTime: new Date(data.response.startTime),
                        endTime: new Date(data.response.endTime),
                    };
                    setDefenseList(
                        produce((draft) => {
                            const index = draft.findIndex((defense) => defense.id === newDefense.id);
                            if (index !== -1) {
                                draft[index] = newDefense;
                            } else {
                                draft.push(newDefense);
                                draft.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
                            }
                        })
                    );
                    if (!locations.find((l) => l.id === newDefense.location.id)) {
                        setLocations(
                            produce((draft) => {
                                draft.push(newDefense.location);
                                draft.sort((a, b) => a.name.localeCompare(b.name));
                            })
                        );
                    }
                    setSelectedDefense(newDefense);
                } else {
                    toast.error(data.response);
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Ha ocurrido un error al guardar la defensa");
            })
            .finally(() => {
                setIsUpdating((prev) => ({ ...prev, saving: false }));
            });
    };

    const deleteDefense = () => {
        if (!selectedDefense || isUpdating.deleting) return;
        setIsUpdating((prev) => ({ ...prev, deleting: true }));
        fetch("/api/dashboard/defense", {
            method: "DELETE",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ defenseId: selectedDefense.id }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    toast.success("Defensa eliminada correctamente");
                    setDefenseList(produce((draft) => draft.filter((defense) => defense.id !== selectedDefense.id)));
                    setSelectedDefense(null);
                } else {
                    toast.error("Error al eliminar la defensa");
                }
            })
            .catch(() => {
                toast.error("Error al eliminar la defensa");
            })
            .finally(() => setIsUpdating((prev) => ({ ...prev, deleting: false })));
    };

    const canSave = () => {
        if (!selectedDefense) return false;
        const result = v.safeParse(DefenseDataSchema, {
            ...selectedDefense,
            startTime: new Date(dates.start.toAbsoluteString()),
            endTime: new Date(dates.end.toAbsoluteString()),
        });
        if (selectedDefense.id < 0 && result.success) {
            return true;
        }

        const target = defenseList.find((defense) => defense.id === selectedDefense.id);
        if (!target) return false;

        if (!result.success) return false;
        return (
            selectedDefense.title !== target.title ||
            dates.start.toAbsoluteString() !== target.startTime.toISOString() ||
            dates.end.toAbsoluteString() !== target.endTime.toISOString() ||
            selectedDefense.location.id !== target.location.id
        );
    };

    return (
        <>
            <div className="w-full h-full flex flex-col flex-1 md:grid md:grid-cols-2 pt-4">
                <section className="flex flex-col">
                    <div className="flex gap-1 pb-3 md:pr-8 flex-col lg:flex-row">
                        <div className="w-full h-full lg:flex-1 flex gap-1">
                            <Listbox
                                value={month}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);
                                    params.set("month", e.toString());
                                    replace(`${pathname}?${params.toString()}`);
                                }}>
                                <ListboxButton className={clsx(HeadlessBasic, "rounded-md max-w-full w-full lg:w-44  text-left")}>
                                    <div className=" flex justify-between items-center">
                                        {months[month]}
                                        <IconChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                                    </div>
                                </ListboxButton>
                                <ListboxOptions
                                    anchor="bottom"
                                    className={clsx(
                                        "z-[400] rounded-md",
                                        "max-w-full w-full lg:w-44 border border-white/5 bg-black/80 backdrop-blur-md p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                                        "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                                    )}>
                                    {Object.entries(months).map(([key, value]) => (
                                        <ListboxOption
                                            key={Number(key)}
                                            value={Number(key)}
                                            className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                            <IconCheck className="invisible size-5 group-data-[selected]:visible" />
                                            {value}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                            <Listbox
                                value={year}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);
                                    params.set("year", e.toString());
                                    replace(`${pathname}?${params.toString()}`);
                                }}>
                                <ListboxButton className={clsx(HeadlessBasic, "rounded-md max-w-full w-full lg:w-28 ")}>
                                    <div className=" flex justify-between items-center">
                                        {year}
                                        <IconChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                                    </div>
                                </ListboxButton>
                                <ListboxOptions
                                    anchor="bottom"
                                    className={clsx(
                                        "z-[400]",
                                        " max-w-full w-full lg:w-28  rounded-xl border border-white/5 bg-black/50 backdrop-blur-md p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                                        "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                                    )}>
                                    {years.map((year) => (
                                        <ListboxOption
                                            key={year}
                                            value={year}
                                            className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                            <IconCheck className="invisible size-5 group-data-[selected]:visible" />
                                            {year}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedDefense({
                                    id: -1,
                                    title: "",
                                    collegeId: -1,
                                    endTime: new Date(),
                                    startTime: new Date(),
                                    location: {
                                        id: -1,
                                        name: "",
                                        mapLink: null,
                                    },
                                });
                                setDates({
                                    start: parseAbsoluteToLocal(new Date().toISOString()),
                                    end: parseAbsoluteToLocal(new Date().toISOString()),
                                });
                            }}
                            className={clsx(BasicButton, InfoButton, "rounded-md col-span-2 lg:col-span-1 mt-1 lg:mt-0  flex-1 lg:max-w-xs")}>
                            <div className="flex items-center justify-between w-full">
                                Crear defensa <IconPlus size={17} />
                            </div>
                        </Button>
                    </div>
                    <div className="relative flex-1 min-h-96 md:h-auto">
                        {isFetching ? (
                            <div className="w-full h-full md:pr-8">
                                <div className="w-full h-full flex items-center justify-center gap-1 bg-black/50 rounded-lg">
                                    <Spinner color="white" size="lg" />
                                </div>
                            </div>
                        ) : defenseList.length > 0 ? (
                            <SimpleBarAbs className="pr-3">
                                <ul className="relative flex flex-col gap-2 pr-5">
                                    {defenseList.map((defense) => (
                                        <li key={defense.id}>
                                            <DefenseButton
                                                selected={selectedDefense?.id === defense.id}
                                                selectDefense={() => {
                                                    setSelectedDefense(defense);
                                                    setDates(
                                                        produce((draft) => {
                                                            draft.start = parseAbsoluteToLocal(defense.startTime.toISOString());
                                                            draft.end = parseAbsoluteToLocal(defense.endTime.toISOString());
                                                        })
                                                    );
                                                }}
                                                date={format(defense.startTime, "dd MMMM yyyy", { locale: es })}
                                                startTime={format(defense.startTime, " HH:mm", { locale: es })}
                                                endTime={format(defense.endTime, "HH:mm", { locale: es })}
                                                title={defense.title}
                                                location={defense.location.name}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </SimpleBarAbs>
                        ) : (
                            <div className="w-full h-full md:pr-8">
                                <div className="w-full h-full flex items-center justify-center gap-1 bg-black/50 rounded-lg">
                                    No hay defensas para
                                    <span className="text-yellow-500">
                                        {months[month]} {year}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
                <Divider className="my-3 block md:hidden" />
                <section className="bg-black/50 rounded-lg p-3 ">
                    {selectedDefense ? (
                        <>
                            <div className="flex justify-between items-center text-2xl font-semibold uppercase mb-3">
                                {selectedDefense.id < 0 ? (
                                    <h1>Nueva defensa</h1>
                                ) : (
                                    <>
                                        <h1>Editar defensa</h1>
                                        <span className="text-tiny text-nova-gray">ID: {selectedDefense.id}</span>
                                    </>
                                )}
                            </div>
                            <Field>
                                <Label className={"text-sm"}>
                                    Título
                                    <Required />
                                    <CharacterCounter className="pl-1" currentLength={selectedDefense.title.length} max={MAX_DEFENSE_TITLE_LENGTH} />
                                </Label>
                                <Input
                                    invalid={selectedDefense.title.length > MAX_DEFENSE_TITLE_LENGTH || selectedDefense.title.length === 0}
                                    onChange={(e) => {
                                        const result = v.safeParse(DefenseDataSchema.entries.title, e.target.value);
                                        setErroMessages(
                                            produce((draft) => {
                                                draft.title = result.issues?.[0].message ?? "";
                                            })
                                        );

                                        updateDefense({ title: e.target.value });
                                    }}
                                    value={selectedDefense.title}
                                    className={clsx(HeadlessComplete, "rounded-md")}
                                />
                                <span className="error-message">{errorMessages.title}</span>
                            </Field>
                            <DatePicker
                                onChange={(e) => {
                                    console.log(e);
                                    setDates(
                                        produce((draft) => {
                                            draft.start = draft.start.set({ day: e.day, month: e.month, year: e.year });
                                            console.log(draft.start);
                                            console.log(draft.start.toAbsoluteString());
                                            draft.end = draft.end.set({ day: e.day, month: e.month, year: e.year });
                                        })
                                    );
                                }}
                                value={dates.start}
                                granularity="day"
                                label={
                                    <span>
                                        Fecha
                                        <Required />
                                    </span>
                                }
                                labelPlacement="outside"
                                className="mt-2"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <TimeInput
                                    label={
                                        <span>
                                            Desde
                                            <Required />
                                        </span>
                                    }
                                    onChange={(e) => {
                                        setDates(
                                            produce((draft) => {
                                                draft.start = draft.start.set({ hour: e.hour, minute: e.minute, second: 0, millisecond: 0 });
                                                console.log("start", draft.start.toAbsoluteString());
                                            })
                                        );
                                    }}
                                    startContent={<IconClock className="text-xl text-default-400 pointer-events-none flex-shrink-0" />}
                                    hourCycle={24}
                                    value={dates.start}
                                    granularity="minute"
                                    labelPlacement="outside"
                                    className="mt-2"
                                />
                                <TimeInput
                                    label={
                                        <span>
                                            Hasta
                                            <Required />
                                        </span>
                                    }
                                    onChange={(e) => {
                                        setDates(
                                            produce((draft) => {
                                                draft.end = draft.end.set({ hour: e.hour, minute: e.minute, second: 0, millisecond: 0 });
                                                console.log("end", draft.end.toAbsoluteString());
                                            })
                                        );
                                    }}
                                    startContent={<IconClock className="text-xl text-default-400 pointer-events-none flex-shrink-0" />}
                                    hourCycle={24}
                                    value={dates.end}
                                    granularity="minute"
                                    labelPlacement="outside"
                                    className="mt-2"
                                />
                            </div>
                            <Autocomplete
                                className="max-w-full w-96"
                                data={locations}
                                value={selectedDefense.location}
                                placeholder="Buscar..."
                                onChange={(value) => {
                                    if (value) {
                                        setSelectedDefense(
                                            produce((draft) => {
                                                if (draft) draft.location = value;
                                            })
                                        );
                                    } else {
                                        setSelectedDefense(
                                            produce((draft) => {
                                                if (draft) draft.location = { id: -1, name: "", mapLink: null };
                                            })
                                        );
                                    }
                                }}
                                displayValue={(location: Location | null) => (location ? location.name : "")}
                                defaultValue={<div className="text-sm/6 text-default-600">(Nueva localización)</div>}
                                label="Localización"
                            />
                            {selectedDefense.location.id < 0 && (
                                <div className="mt-3 p-3 rounded-lg border-dashed border-blue-500 border-1">
                                    Nueva localización
                                    <Field>
                                        <Label className={"text-tiny"}>
                                            Nombre <Required />
                                        </Label>
                                        <Input
                                            invalid={errorMessages.locationName.length > 0}
                                            onChange={(e) => {
                                                const result = v.safeParse(DefenseDataSchema.entries.location.entries.name, e.target.value);
                                                setErroMessages(
                                                    produce((draft) => {
                                                        draft.locationName = result.issues?.[0].message ?? "";
                                                    })
                                                );

                                                setSelectedDefense(
                                                    produce((draft) => {
                                                        if (draft) draft.location.name = e.target.value;
                                                    })
                                                );
                                            }}
                                            value={selectedDefense.location.name}
                                            className={clsx(HeadlessComplete, "rounded-md")}></Input>
                                    </Field>
                                    <span className="error-message">{errorMessages.locationName}</span>
                                    <Field className={"mt-2"}>
                                        <Label className={"text-tiny"}>Link de la localización</Label>
                                        <Input
                                            onChange={(e) =>
                                                setSelectedDefense(
                                                    produce((draft) => {
                                                        if (draft) draft.location.mapLink = e.target.value ?? null;
                                                    })
                                                )
                                            }
                                            value={selectedDefense.location.mapLink ?? ""}
                                            placeholder="(Opcional)"
                                            className={clsx(HeadlessComplete, "rounded-md")}></Input>
                                    </Field>
                                </div>
                            )}
                            <div className="flex justify-end mt-4 gap-1">
                                {selectedDefense.id >= 0 && (
                                    <Button
                                        className={clsx(BasicButton, DangerButton, "rounded-md")}
                                        onClick={() => {
                                            setIsDeleteDialogOpen(true);
                                        }}>
                                        {isUpdating.deleting ? <Spinner size="sm" color="white" /> : "Borrar"}
                                    </Button>
                                )}
                                <Button
                                    className={clsx(BasicButton, PrimaryButton, "rounded-md", !canSave() && "opacity-50 && pointer-events-none")}
                                    onClick={saveDefense}>
                                    {isUpdating.saving ? <Spinner size="sm" color="white" /> : selectedDefense.id < 0 ? "Crear" : "Actualizar"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full min-h-96 flex items-center justify-center text-nova-gray text-lg">Selecciona una defensa</div>
                    )}
                </section>
            </div>
            <Dialog open={isDeleteDialogOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeDeleteDialog}>
                <DialogBackdrop className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        {selectedDefense && (
                            <DialogPanel
                                transition
                                className="w-full max-w-2xl rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
                                <div className="text-center items-center">
                                    <div className="flex justify-center">
                                        <IconCalendarMinus size={100} className="opacity-50 mb-2" />
                                    </div>
                                    Estás a punto de eliminar la defensa &quot;
                                    <span className="text-yellow-500 font-semibold">{selectedDefense.title}</span>&quot; del día
                                    <p>
                                        <span className="text-yellow-500">{format(selectedDefense.startTime, "dd MMMM yyyy", { locale: es })}</span>{" "}
                                        {`(${format(selectedDefense.startTime, "HH:mm", { locale: es })} : ${format(
                                            selectedDefense.endTime,
                                            "HH:mm",
                                            {
                                                locale: es,
                                            }
                                        )})`}
                                    </p>
                                </div>
                                <p className="text-center">¿Estás seguro?</p>
                                <div className="mt-4 flex justify-center">
                                    <Button
                                        className={clsx(BasicButton, DangerButton)}
                                        onClick={() => {
                                            closeDeleteDialog();
                                            deleteDefense();
                                        }}>
                                        Sí, bórralo
                                    </Button>
                                </div>
                            </DialogPanel>
                        )}
                    </div>
                </div>
            </Dialog>
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
        </>
    );
}
