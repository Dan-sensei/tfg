"use client";
import { Calendar } from "@nextui-org/calendar";
import { useState } from "react";

export default function DefenseForm() {
    const [date, setDate] = useState(new Date());
    return (
        <div className="pt-4">
            <Calendar
                aria-label="Date (Show Month and Year Picker)"
                showMonthAndYearPickers
                classNames={{
                    base: "dark:bg-black/50 bg-black/50 border-1 border-yellow-500/15 ",
                    headerWrapper: "bg-black/60",
                    gridHeader: "bg-black/60",
                    header: "bg-white/10 border-1 border-white/10",
                    pickerWrapper: "bg-black/50",
                    cell: "",
                    cellButton:
                        " data-[selected]:bg-yellow-400 data-[selected]:data-[hover]:bg-yellow-400 data-[selected]:text-black data-[selected]:data-[hover]:text-black data-[hover]:bg-yellow-400/50 data-[hover]:text-white",
                }}
            />
        </div>
    );
}
