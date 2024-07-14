"use client";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, Field, Label } from "@headlessui/react";
import { Required } from "./BasicComponents";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

type ComboboxFieldProps<T> = {
    className?: string;
    label?: string;
    placeholder: string;
    data: T[];
    value: T | null;
    onChange: (value: T | null) => void;
    displayValue: (item: T | null) => string;
    optionsDisplay?: (item: T) => string | JSX.Element;
    required?: boolean;
    defaultValue?: string | JSX.Element;
};

export default function Autocomplete<T extends { id: number; name: string }>({
    className,
    label,
    placeholder,
    data,
    value,
    required = false,
    onChange,
    displayValue,
    optionsDisplay,
    defaultValue,
}: ComboboxFieldProps<T>) {
    const [dataList, setDataList] = useState(data);
    const [query, setQuery] = useState("");
    const defaulOptionsDisplay = (item: T) => {
        return (
            <>
                <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                <div className="text-sm/6 text-white">{item.name}</div>
            </>
        );
    };
    useEffect(() => {
        setDataList(data);
    }, [data]);

    const filteredData = query === "" ? dataList : dataList.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    return (
        <Field className={clsx("mt-3", className)}>
            <Label className="text-sm text-default-600 flex">
                {label && (
                    <>
                        {label}
                        {required && <Required />}
                    </>
                )}
            </Label>
            <Combobox
                immediate
                value={value}
                onChange={(value) => {
                    if (required && value === null) return;
                    onChange(value);
                }}
                onClose={() => setQuery("")}>
                <div className="relative">
                    <ComboboxInput
                        className={clsx(
                            "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                        )}
                        spellCheck={false}
                        placeholder={placeholder}
                        displayValue={(item: T) => displayValue(item)}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <IconChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                    </ComboboxButton>
                </div>
                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        "z-[400]",
                        "w-[var(--input-width)] rounded-xl border border-white/5 bg-black/50 backdrop-blur-md p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                        "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                    )}>
                    {!required && (
                        <ComboboxOption
                            key={-1}
                            value={null}
                            className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                            {defaultValue ? (
                                defaultValue
                            ) : (
                                <>
                                    <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                                    <div className="text-sm/6 text-default-600">(Ninguno)</div>
                                </>
                            )}
                        </ComboboxOption>
                    )}
                    {filteredData.map((item) => (
                        <ComboboxOption
                            key={item.id}
                            value={item}
                            className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                            {optionsDisplay ? optionsDisplay(item) : defaulOptionsDisplay(item)}
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </Field>
    );
}
