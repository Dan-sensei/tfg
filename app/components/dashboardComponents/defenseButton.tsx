"use client";

import { Button } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { BasicButton } from "../../lib/headlessUIStyle";

type Props = {
    className?: string;
    selected: boolean;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    selectDefense: () => void;
};
export default function DefenseButton({ className, selected, title, date, startTime, endTime, location, selectDefense }: Props) {
    return (
        <Button
            onClick={selectDefense}
            className={clsx(className, selected ? "bg-blue-600" : "bg-white/5 data-[hover]:bg-white/10", "w-full rounded-lg ", BasicButton)}>
            <div className="w-full text-left ">
                <div className="text-xl">
                    {title} - <span className="text-sm">{date}</span>
                </div>
                <div className="text-nova-gray">
                    {startTime} - {endTime}
                </div>
                <div>
                    <span className="text-tiny text-nova-gray">Localización: </span> {location}
                </div>
            </div>
        </Button>
    );
}
