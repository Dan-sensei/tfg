import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    subMonths,
    addMonths,
    formatRelative,
    addDays,
    format,
    subDays,
} from "date-fns";
import CalendarControls from "./calendarControls";
import { bebas_Neue, tulpen_one } from "@/app/lib/fonts"
import { unstable_cache as cache } from "next/cache";
import prisma from "@/app/lib/db";
import {
    convertDateToUTC,
    convertUTCDateToLocalDateKey,
    eachDayOfIntervalUTC,
    endOfMonthUTC,
    endOfWeekUTC,
    startOfMonthUTC,
    startOfWeekUTC,
} from "@/app/utils/util"
import DayButton from "./dayButton";
import { es } from "date-fns/locale";
import { IconCactus, IconMapPin } from "@tabler/icons-react";
import GlimmerSpot from "@/app/components/GlimmerSpot"
import { Divider } from "@nextui-org/divider";

type Props = {
    searchParams?: {
        year?: string;
        month?: string;
        selected?: string;
    };
};

interface DefenseData {
    title: string;
    startTime: Date;
    endTime: Date;
    location: {
        name: string;
        mapLink: string;
    };
}

const getMonthDefenses = cache(
    async (from: Date, to: Date) => {
        const defenses = (await prisma.defense.findMany({
            select: {
                title: true,
                startTime: true,
                endTime: true,
                location: {
                    select: {
                        name: true,
                        mapLink: true,
                    },
                },
            },
            where: {
                startTime: {
                    gte: from,
                    lte: to,
                },
            },
        })) as DefenseData[];

        return defenses;
    },
    ["month-defenses"],
    {
        tags: ["month-defenses"],
    }
);

type SelectedDate = {
    year: string;
    month: string;
    day: string;
};

export default async function Defensas({ searchParams }: Props) {
    const now = new Date();
    const year = Number(searchParams?.year || now.getFullYear());
    const month = Number(searchParams?.month || now.getMonth() + 1);
    let selectedDate: SelectedDate = {
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString(),
        day: now.getDate().toString(),
    };
    if (
        searchParams?.selected &&
        searchParams?.selected.split("-").length === 3
    ) {
        const date = searchParams?.selected.split("-");
        selectedDate = {
            year: date[0],
            month: date[1],
            day: date[2],
        };
    }

    const defensesByDate: { [key: string]: DefenseData[] } = {};

    const defenses = await getMonthDefenses(
        subDays(startOfMonth(new Date(Date.UTC(year, month-1))), 10),
        addDays(endOfMonth(new Date(Date.UTC(year, month-1))), 10)
    );

    defenses.forEach((defense) => {
        const defenseDate = convertUTCDateToLocalDateKey(
            defense.startTime.toString()
        );
        if (!defensesByDate[defenseDate]) {
            defensesByDate[defenseDate] = [];
        }
        defensesByDate[defenseDate].push(defense);
    });

    const getMonthDaysGrid = (date: Date) => {
        const startDay = startOfWeekUTC(startOfMonthUTC(date));
        const endDay = endOfWeekUTC(endOfMonthUTC(date));
        return eachDayOfIntervalUTC(startDay, endDay);
    };

    const days = getMonthDaysGrid(new Date(Date.UTC(year, month - 1)));
    const daysWithDefenses = days.map((day) => {
        const dayKey = day.toISOString().split("T")[0];
        return {
            date: new Date(day),
            hasDefenses: defensesByDate[dayKey] ? true : false,
        };
    });

    const WEEK = ["L", "M", "X", "J", "V", "S", "D"];

    const DateSelected = new Date(
        Date.UTC(
            Number(selectedDate.year),
            Number(selectedDate.month) - 1,
            Number(selectedDate.day)
        )
    );

    const defenseData =
        defensesByDate[
            `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`
        ];
    return (
        <div className="xl:container mx-auto h-full lg:h-auto">
            <div className="flex flex-col flex-wrap lg:grid lg:grid-cols-3 py-3 h-full">
                <div className="lg:col-span-2 flex flex-col lg:max-h-[1000px] w-full md:px-32 lg:px-0">
                    <CalendarControls year={year} month={month} />
                    <div className="flex text-2xl lg:pt-3">
                        {WEEK.map((day, index) => (
                            <div
                                key={index}
                                className="w-full p-4 text-center text-slate-300"
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                    <div
                        className={`${bebas_Neue.className} gap-2 grid grid-cols-7 text-xl lg:text-2xl 2xl:text-4xl lg:flex-1 rounded-2xl`}
                    >
                        {daysWithDefenses.map((day, index) => (
                            <DayButton
                                key={index}
                                year={day.date.getUTCFullYear()}
                                month={day.date.getUTCMonth()}
                                day={day.date.getUTCDate()}
                                selected={
                                    Number(selectedDate.year) ===
                                        day.date.getUTCFullYear() &&
                                    Number(selectedDate.month) ===
                                        day.date.getUTCMonth() + 1 &&
                                    Number(selectedDate.day) ===
                                        day.date.getUTCDate()
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
                                {format(DateSelected, "EEEE", { locale: es })}
                            </div>
                            <div className="pl-3 inline-block capitalize font-semibold text-sm md:text-md lg:text-sm xl:text-lg text-gray-400">
                                {format(DateSelected, "dd MMMM yyyy", {
                                    locale: es,
                                })}
                            </div>
                        </div>
                        <section className="flex grow relative">
                            <div className="absolute top-0 left-0 bottom-0 right-0 overflow-y-auto pt-5 ">
                                {defenseData && defenseData.length > 0 ? (
                                    defenseData.map((defense, index) => (
                                        <>
                                            <div key={index} className="flex">
                                                <div className="pt-2 pr-2">
                                                    <GlimmerSpot
                                                        classname="w-2 h-2"
                                                        color="rgb(0 111 238)"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className=" text-base md:text-xl lg:text-base xl:text-xl">
                                                        {defense.title}
                                                    </div>
                                                    <div className="text-gray-400 uppercase  text-sm md:text-xl lg:text-sm xl:text-lg -mt-1">
                                                        {format(
                                                            new Date(
                                                                defense.startTime
                                                            ),
                                                            "HH:mm aaaaa'm'",
                                                            { locale: es }
                                                        )}
                                                        {" - "}
                                                        {format(
                                                            new Date(
                                                                defense.endTime
                                                            ),
                                                            "HH:mm aaaaa'm'",
                                                            { locale: es }
                                                        )}
                                                    </div>
                                                </div>
                                                <button role="button">
                                                    <IconMapPin
                                                        className="transition-colors hover:text-blue-500 stroke-1"
                                                        size={38}
                                                    />
                                                </button>
                                            </div>
                                            {index < defenseData.length - 1 && (
                                                <Divider className="my-3" />
                                            )}
                                        </>
                                    ))
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-gray-400 uppercase font-semibold text-sm md:text-xl lg:text-sm xl:text-lg text-center">
                                            <IconCactus
                                                size={128}
                                                className="mx-auto stroke-1"
                                            />
                                            No hay defensas para este día
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
