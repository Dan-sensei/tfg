"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, Field, Label } from "@headlessui/react";
import { Required } from "../components/BasicComponentes";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

type ComboboxFieldProps<T> = {
    label: string;
    placeholder: string;
    data: T[];
    value: T | null;
    onChange: (value: T | null) => void;
    displayValue: (item: T) => string;
    required?: boolean;
};

export default function Autocomplete<T extends { id: number; name: string }>({
    label,
    placeholder,
    data,
    value,
    required = false,
    onChange,
    displayValue,
}: ComboboxFieldProps<T>) {
    const [query, setQuery] = useState("");

    const filteredData = query === "" ? data : data.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <Field className="mt-3">
            <Label className="text-sm text-default-600">
                {label}
                {required && <Required />}
            </Label>
            <Combobox
                immediate
                value={value}
                onChange={(value) => {
                    onChange(value);
                }}
                onClose={() => setQuery("")}>
                <div className="relative">
                    <ComboboxInput
                        className={clsx(
                            "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                        )}
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
                        "w-[var(--input-width)] rounded-xl border border-white/5 bg-black/85 backdrop-blur-md p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                        "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                    )}>
                    {!required && (
                        <ComboboxOption
                            key={-1}
                            value={null}
                            className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                            <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                            <div className="text-sm/6 text-default-600">(Ninguno)</div>
                        </ComboboxOption>
                    )}
                    {filteredData.map((item) => (
                        <ComboboxOption
                            key={item.id}
                            value={item}
                            className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                            <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                            <div className="text-sm/6 text-white">{item.name}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </Field>
    );
}
