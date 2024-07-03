"use client";

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from "@headlessui/react";
import { Required } from "./BasicComponentes";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { assert } from "console";

interface HasStringProperties {
    [key: string]: string;
}

interface WithId {
    id: number;
}

type Props<T> = {
    selected: T;
    data: T[];
    searchBy: keyof T;
    label: string;
    updateForm: (data: any) => void;
};

type AutocompleteItem = WithId & HasStringProperties;
export default function Autocomplete<T extends AutocompleteItem>({ selected, data, searchBy, label, updateForm }: Props<T>) {
    const [query, setQuery] = useState("");
    const fileteredValues =
        query === ""
            ? data
            : data.filter((value) => {
                  return (value[searchBy] as string).toLowerCase().includes(query.toLowerCase());
              });
    return (
        <Field className={"mt-3"}>
            <Label className={"text-sm text-default-600"}>
                {label}
                <Required />
            </Label>
            <Combobox
                immediate
                value={selected}
                onChange={(value) => {
                    if (value) {
                        updateForm({ category: value });
                    }
                }}>
                <div className="relative">
                    <ComboboxInput
                        className={clsx(
                            "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                        )}
                        placeholder="Buscar..."
                        displayValue={(category: T) => category?.name}
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
                        "w-[var(--input-width)] rounded-xl border border-white/5 bg-black/85  backdrop-blur-md p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                        "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                    )}>
                    {fileteredValues.map((val) => (
                        <ComboboxOption
                            key={val.id}
                            value={val}
                            className="hover:cursor-pointer group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                            <IconCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                            <div className="text-sm/6 text-white">{val[searchBy]}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </Field>
    );
}
