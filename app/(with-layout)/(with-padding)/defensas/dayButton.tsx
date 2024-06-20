"use client";

import { addMonths, format, subMonths } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { es } from "date-fns/locale";
import GlimmerSpot from "@/app/components/GlimmerSpot"

type Props = {
    year: number;
    month: number;
    day: number;
    sameMonth: boolean;
    hasDefenses: boolean;
    selected: boolean;
    classname?: string;
};
export default function DayButton({
    year,
    month,
    day,
    sameMonth,
    hasDefenses,
    classname,
    selected,
}: Props) {
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const updateRouter = () => {
        if(selected){
            return;
        }
        const params = new URLSearchParams(searchParams);
        params.set("year", year.toString());
        params.set("month", (month+1).toString());
        params.set("selected", `${year}-${(month+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
        replace(`${pathname}?${params.toString()}`);
    };

    let background = ""
    if(sameMonth){
        background = selected? "text-nova-link  bg-blue-500" : "text-nova-link  hover:bg-nova-light2/50 border-1 lg:border-1 border-white/10";
    }
    else{
        background = selected? "text-slate-600  bg-nova-light/20" : "text-slate-600  hover:bg-nova-light/20 border-1 lg:border-1 border-white/10";
    }

    return (
        <button
            role="button"
            type="button"
            onClick={updateRouter}
            className={`${classname} bg-[#07090c] p-1 sm:p-3 rounded-lg aspect-square transition-colors ${background}`}
        >
            <div className="relative h-full w-full flex items-center justify-center ">
                {hasDefenses && <GlimmerSpot classname="absolute top-0 w-2 sm:w-2 h-2 sms:h-2 right-0" color={`${selected ? "white" : "rgb(0 111 238)"}`}/>}
                {day}
            </div>
        </button>
    );
}
