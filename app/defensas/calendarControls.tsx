"use client";

import { addMonths, format, subMonths } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { es } from "date-fns/locale";

type Props = {
    year: number;
    month: number;
    classname?: string;
};

type CalendarButtonControl = {
    classname?: string;
    active?: boolean;
    year: string;
    month: string;
    updateMonths: number;
};
export default function CalendarControls({ year, month, classname }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const activeDate = new Date(year, month - 1);
    const updateRouter = (increment: number) => {
        const newDate = addMonths(activeDate, increment);
        const params = new URLSearchParams(searchParams);
        params.set("year", newDate.getFullYear().toString());
        params.set("month", (newDate.getMonth() + 1).toString());
        params.set("display", (newDate.getMonth() + 1).toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const buttons: CalendarButtonControl[] = [
        {
            classname: "hidden lg:block",
            year: format(subMonths(activeDate, 2), "yyyy"),
            month: format(subMonths(activeDate, 2), "MMMM", {
                locale: es,
            }).toUpperCase(),
            updateMonths: -2,
        },
        {
            year: format(subMonths(activeDate, 2), "yyyy"),
            month: format(subMonths(activeDate, 1), "MMMM", {
                locale: es,
            }).toUpperCase(),
            updateMonths: -1,
        },
        {
            active: true,
            year: format(subMonths(activeDate, 2), "yyyy"),
            month: format(activeDate, "MMMM", {
                locale: es,
            }).toUpperCase(),
            updateMonths: 0,
        },
        {
            year: format(subMonths(activeDate, 2), "yyyy"),
            month: format(addMonths(activeDate, 1), "MMMM", {
                locale: es,
            }).toUpperCase(),
            updateMonths: 1,
        },
        {
            classname: "hidden lg:block",
            year: format(subMonths(activeDate, 2), "yyyy"),
            month: format(addMonths(activeDate, 2), "MMMM", {
                locale: es,
            }).toUpperCase(),
            updateMonths: 2,
        },
    ];

    return (
        <>
            <div
                className={`${
                    classname ?? ""
                } grid grid-cols-3 lg:grid-cols-5 text-center`}
            >
                {buttons.map((button, index) =>
                    button.active ? (
                        <div key={index} className="text-2xl">
                            {" "}
                            <div className=" text-sm text-slate-400 -mb-2">
                                {button.year}
                            </div>{" "}
                            {button.month}
                        </div>
                    ) : (
                        <button
                            key={index}
                            type="button"
                            onClick={() => updateRouter(button.updateMonths)}
                            className={`${
                                button.classname
                            } ${"text-slate-400 hover:text-slate-200 text-lg transition-colors"}`}
                        >
                            <div className="text-sm text-slate-400 -mb-2">
                                {button.year}
                            </div>
                            {button.month}
                        </button>
                    )
                )}
            </div>
        </>
    );
}
