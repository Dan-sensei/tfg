"use client";

import CalendarControls from "./calendarControls";
import { bebas_Neue } from "@/app/lib/fonts";

import { eachDayOfIntervalUTC, endOfMonthUTC, endOfWeekUTC, startOfMonthUTC, startOfWeekUTC } from "@/app/utils/util";
import DayButton from "./dayButton";
import { IconCactus, IconMapPin } from "@tabler/icons-react";
import GlimmerSpot from "@/app/components/GlimmerSpot";
import { Divider } from "@nextui-org/divider";
import { DefenseData } from "@/app/types/interfaces";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { parseAbsoluteToLocal, DateFormatter } from "@internationalized/date";
import React, { useEffect, useState } from "react";
import { produce } from "immer";
import { usePathname, useSearchParams } from "next/navigation";
import SimpleBarAbs from "@/app/components/SimpleBarAbs";

type SelectedDate = {
    year: string;
    month: string;
    day: string;
};
type Props = {
    defenses: DefenseData[];
    year: number;
    month: number;
    selectedDate: SelectedDate;
    userTimeZone: string;
};

export default function Calendar({ defenses, year, month, selectedDate, userTimeZone }: Props) {
    const [defensesByDate, setDefensesByDate] = useState<{ [key: string]: DefenseData[] }>({});
    const [selected, setSelected] = useState<SelectedDate>(selectedDate);
    const [daysWithDefenses, setDayWithDefenses] = useState<
        {
            date: Date;
            hasDefenses: boolean;
        }[]
    >([]);
    const [timeZone, setTimeZone] = useState(userTimeZone);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    useEffect(() => {
        setSelected(
            produce((draft) => {
                const selectedParam = searchParams.get("selected");
                if (!selectedParam) return;
                const [year, month, day] = selectedParam.split("-");
                draft.year = year;
                draft.month = month;
                draft.day = day;
            }, selected)
        );
    }, [searchParams]);

    const formatter_time = new DateFormatter(timeZone, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    const formatter_date = new DateFormatter(timeZone, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const weekdayFormatter = new DateFormatter(timeZone, { weekday: "long" });

    useEffect(() => {
        setTimeZone(userTimeZone);
    }, [userTimeZone]);

    useEffect(() => {
        setDefensesByDate(
            produce((draft) => {
                for (const key in draft) {
                    delete draft[key];
                }
                defenses.forEach((defense) => {
                    const localDate = parseAbsoluteToLocal(new Date(defense.startTime).toISOString());
                    const key = `${localDate.year}-${localDate.month.toString().padStart(2, "0")}-${localDate.day.toString().padStart(2, "0")}`;
                    if (!draft[key]) {
                        draft[key] = [];
                    }
                    draft[key].push(defense);
                });
                Object.keys(draft).forEach((key) => {
                    draft[key].sort((a, b) => {
                        const aTime = new Date(a.startTime).getTime();
                        const bTime = new Date(b.startTime).getTime();
                        return aTime - bTime;
                    });
                });
            })
        );
    }, [defenses]);

    useEffect(() => {
        const getMonthDaysGrid = (date: Date) => {
            const startDay = startOfWeekUTC(startOfMonthUTC(date));
            const endDay = endOfWeekUTC(endOfMonthUTC(date));
            return eachDayOfIntervalUTC(startDay, endDay);
        };
        const days = getMonthDaysGrid(new Date(Date.UTC(year, month - 1)));
        setDayWithDefenses(
            produce((draft) => {
                draft.length = 0;
                days.forEach((day) => {
                    const dayKey = day.toISOString().split("T")[0];
                    draft.push({
                        date: new Date(day),
                        hasDefenses: defensesByDate[dayKey] ? true : false,
                    });
                });
            })
        );
        if (!searchParams.get("year") || !searchParams.get("month")) {
            const params = new URLSearchParams(searchParams);
            if (!searchParams.get("year")) params.set("year", year.toString());
            if (!searchParams.get("month")) params.set("month", month.toString());
            window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
        }
    }, [year, month, defensesByDate]);

    const WEEK = ["L", "M", "X", "J", "V", "S", "D"];

    const DateSelected = new Date(Date.UTC(Number(selected.year), Number(selected.month) - 1, Number(selected.day)));
    const defenseData = defensesByDate[`${selected.year}-${selected.month}-${selected.day}`];
    return (
        <>
            <div className="lg:col-span-2 flex flex-col w-full md:px-32 lg:px-0">
                <CalendarControls year={year} month={month} />
                <div className="flex text-2xl lg:pt-3">
                    {WEEK.map((day, index) => (
                        <div key={index} className="w-full p-4 text-center text-slate-300">
                            {day}
                        </div>
                    ))}
                </div>
                <div className={`${bebas_Neue.className} gap-[2px] lg:gap-2 grid grid-cols-7 text-xl lg:text-2xl 2xl:text-4xl lg:flex-1 rounded-2xl`}>
                    {daysWithDefenses.map((day, index) => (
                        <DayButton
                            key={index}
                            year={day.date.getUTCFullYear()}
                            month={day.date.getUTCMonth()}
                            day={day.date.getUTCDate()}
                            selected={
                                Number(selected.year) === day.date.getUTCFullYear() &&
                                Number(selected.month) === day.date.getUTCMonth() + 1 &&
                                Number(selected.day) === day.date.getUTCDate()
                            }
                            sameMonth={month == day.date.getMonth() + 1}
                            hasDefenses={day.hasDefenses}
                        />
                    ))}
                </div>
            </div>
            <div className="cols-span-1 lg:flex w-full flex flex-col lg:flex-row grow flex-wrap">
                <div className="w-full lg:w-auto lg:h-full py-2 pt-5 pb-4 lg:pb-0 lg:pt-0 lg:px-2">
                    <div className="w-full h-[2px] bg-gradient-to-r lg:h-full lg:w-[2px] lg:bg-gradient-to-t from-transparent via-blue-500"></div>
                </div>
                <div className="bg-black/30 rounded-lg p-5 w-full min-h-80 lg:w-auto lg:h-full flex-1 flex flex-col">
                    <div>
                        <div className="inline-block capitalize font-bold text-2xl md:text-2xl xl:text-3xl">
                            {weekdayFormatter.format(DateSelected)}
                        </div>
                        <div className="pl-3 inline-block capitalize font-semibold text-sm md:text-md lg:text-sm xl:text-lg text-gray-400">
                            {formatter_date.format(DateSelected)}
                        </div>
                    </div>
                    <section className="flex grow relative">
                        <SimpleBarAbs className="pt-5">

                        
                            {defenseData && defenseData.length > 0 ? (
                                defenseData.map((defense, index) => (
                                    <React.Fragment key={defense.id}>
                                        <div className="flex pr-4">
                                            <div className="pt-2 pr-2">
                                                <GlimmerSpot classname="w-2 h-2" color="rgb(0 111 238)" />
                                            </div>
                                            <div className="flex-1">
                                                <div className=" text-base md:text-xl lg:text-base xl:text-xl">{defense.title}</div>
                                                <div className="text-gray-400 uppercase  text-sm md:text-xl lg:text-sm xl:text-lg -mt-1">
                                                    {formatter_time.format(defense.startTime)}
                                                    {" - "}
                                                    {formatter_time.format(defense.endTime)}
                                                </div>
                                            </div>
                                            {defense.location.mapLink && (
                                                <Button
                                                    as={Link}
                                                    href={defense.location.mapLink}
                                                    isIconOnly
                                                    className="rounded-full "
                                                    color="primary"
                                                    variant="flat"
                                                    role="button">
                                                    <IconMapPin className="stroke-1" size={30} />
                                                </Button>
                                            )}
                                        </div>
                                        {index < defenseData.length - 1 && <Divider className="my-3" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-gray-400 uppercase font-semibold text-sm text-center">
                                        <IconCactus size={80} className="mx-auto stroke-1" />
                                        No hay defensas para este día
                                    </div>
                                </div>
                            )}
                            </SimpleBarAbs>
                    </section>
                </div>
            </div>
        </>
    );
}
