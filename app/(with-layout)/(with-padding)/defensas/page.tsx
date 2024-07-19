import { startOfMonth, endOfMonth, addDays, subDays } from "date-fns";

import prisma from "@/app/lib/db";

import Calendar from "./calendar";
import { DefenseData } from "@/app/types/interfaces";
import { headers } from "next/headers";
import { getPreferredLocale } from "@/app/utils/util";

type Props = {
    searchParams?: {
        year?: string;
        month?: string;
        selected?: string;
    };
};

const getMonthDefenses = async (from: Date, to: Date) => {
    const defenses = (await prisma.defense.findMany({
        select: {
            id: true,
            collegeId: true,
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
};

export default async function Defensas({ searchParams }: Props) {
    const now = new Date();
    const year = Number(searchParams?.year || now.getFullYear());
    const month = Number(searchParams?.month || now.getMonth() + 1);
    let selectedDate = {
        year: now.getFullYear().toString().padStart(2, "0"),
        month: (now.getMonth() + 1).toString().padStart(2, "0"),
        day: now.getDate().toString().padStart(2, "0"),
    };
    if (searchParams?.selected && searchParams?.selected.split("-").length === 3) {
        const date = searchParams?.selected.split("-");
        selectedDate = {
            year: date[0],
            month: date[1].padStart(2, "0"),
            day: date[2].padStart(2, "0"),
        };
    }
    const languageHeaders = headers().get('accept-language');
    const acceptLanguage = languageHeaders ? getPreferredLocale(languageHeaders) : 'es-ES';
    const defenses = await getMonthDefenses(
        subDays(startOfMonth(new Date(Date.UTC(year, month - 1))), 10),
        addDays(endOfMonth(new Date(Date.UTC(year, month - 1))), 10)
    );
    
    return (
        <div className="xl:container mx-auto h-full lg:h-auto">
            <div className="flex flex-col flex-wrap lg:grid lg:grid-cols-3 py-3 h-full">
                <Calendar defenses={defenses} year={year} month={month} selectedDate={selectedDate} userTimeZone={acceptLanguage} />
            </div>
        </div>
    );
}
