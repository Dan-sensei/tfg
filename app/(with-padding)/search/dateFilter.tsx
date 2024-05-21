"use client";
import { useEffect, useState } from "react";
import { SearchParams } from "./page";
import { Calendar, RangeCalendar, RangeValue } from "@nextui-org/calendar";

import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { parseDate } from "@internationalized/date";

interface PopularTagsProps {
    filters: SearchParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function DateFilter({
    filters,
    updateFilters,
}: PopularTagsProps) {
    const [selectedTab, setSelectedTab] = useState("from");
    let [from, setFrom] = useState<DateValue | null>(null);
    const [focusedFrom, setFocusedFrom] = useState<DateValue | undefined>(undefined);
    let [to, setTo] = useState<DateValue | null>(null);
    const [focusedTo, setFocusedTo] = useState<DateValue | undefined>(undefined);

    let [rangeValue, setRangeValue] = useState<
        RangeValue<DateValue> | null
    >(null);

    let [focusedRangeValue, setFocusedRangeValue] = useState<DateValue | undefined>(undefined);
    const handleSelectionChange = (value: string) => {
        updateFilters({
            date: value,
        });
    };
    const formatToUTC = (date: DateValue, isEndOfDay: boolean = false) => {
        if (isEndOfDay) {
            return new Date(
                Date.UTC(date.year, date.month - 1, date.day, 23, 59, 59)
            )
                .toISOString()
                .split("T")[0];
        }
        return new Date(Date.UTC(date.year, date.month - 1, date.day))
            .toISOString()
            .split("T")[0];
    };

    useEffect(() => {
        if (filters.date) {
            if (filters.date.startsWith("f")) {
                const fromDate = filters.date.slice(1);
                setSelectedTab("from")
                setFocusedFrom(parseDate(fromDate))
                setFrom(parseDate(fromDate))
            } else if (filters.date.startsWith("t")) {
                const toDate = filters.date.slice(1);
                setSelectedTab("to")
                setTo(parseDate(toDate))
                setFocusedTo(parseDate(toDate))
            } else if (filters.date.startsWith("r")) {
                const [startDate, endDate] = filters.date.slice(1).split("t");
                setSelectedTab("between")
                setRangeValue({
                    start: parseDate(startDate),
                    end: parseDate(endDate)
                })
            }
            else {
                updateFilters({
                    date: undefined
                })
            }
        }
    }, [filters.date]);

    const formatRangeToUTC = (range: RangeValue<DateValue>) => {
        const startDate = new Date(
            Date.UTC(range.start.year, range.start.month - 1, range.start.day)
        );
        const endDate = new Date(
            Date.UTC(
                range.end.year,
                range.end.month - 1,
                range.end.day,
                23,
                59,
                59
            )
        );
        return `r${startDate.toISOString().split("T")[0]}t${
            endDate.toISOString().split("T")[0]
        }`;
    };

    const clearDataParam = () => {
        updateFilters({
            date: undefined,
        });
    };

    const handleTabChange = (key: React.Key) => {
        setSelectedTab(key.toString())
        if(key === "from" && from) {
            updateFilters({
                date: `f${formatToUTC(from)}`,
            });
        } else if(key === "to" && to) {
            updateFilters({
                date: `t${formatToUTC(to, true)}`,
            });
        } else if(key === "between" && rangeValue) {
            updateFilters({
                date: formatRangeToUTC(rangeValue),
            });
        } else {
            clearDataParam();
        }
    };
    return (
        <div className="flex flex-wrap justify-center pt-2">
            <Tabs
                variant="bordered"
                color="primary"
                classNames={{
                    base: "w-full px-2",
                    tabList: "p-0 rounded-full py-0 w-full",
                    tabContent: " py-0",
                    panel: "mt-3 ",
                }}
                selectedKey={selectedTab}
                onSelectionChange={handleTabChange}
            >
                <Tab key="from" className="text-tiny py-0" title="Después de">
                    <Calendar
                        aria-label="Date (Presets)"
                        classNames={{
                            content: "w-full text-normal",
                            base: "text-base",
                        }}
                        nextButtonProps={{
                            variant: "bordered",
                        }}
                        prevButtonProps={{
                            variant: "bordered",
                        }}
                        value={from}
                        focusedValue={focusedFrom}
                        onFocusChange={setFocusedFrom}
                        onChange={(e) => {
                            setFrom(e);
                            handleSelectionChange(`f${formatToUTC(e)}`);
                        }}
                        bottomContent={
                            <div className="flex justify-center pb-3">
                                <Button
                                    variant="bordered"
                                    radius="full"
                                    className="h-8"
                                    onClick={() => {
                                        setFrom(null);
                                        clearDataParam();
                                    }}
                                >
                                    Limpiar selección
                                </Button>
                            </div>
                        }
                    />
                </Tab>
                <Tab key="between" className=" text-tiny py-0" title="Entre">
                    <RangeCalendar
                        aria-label="Date (Presets)"
                        classNames={{
                            content: "w-full",
                            base: "text-base",
                        }}
                        focusedValue={focusedRangeValue}
                        nextButtonProps={{
                            variant: "bordered",
                        }}
                        prevButtonProps={{
                            variant: "bordered",
                        }}
                        value={rangeValue}
                        onChange={(e) => {
                            setRangeValue(e);
                            handleSelectionChange(formatRangeToUTC(e));
                        }}
                        onFocusChange={setFocusedRangeValue}
                        bottomContent={
                            <div className="flex justify-center pb-3">
                                <Button
                                    variant="bordered"
                                    radius="full"
                                    className="h-8"
                                    onClick={() => {
                                        setRangeValue(null);
                                        clearDataParam();
                                    }}
                                >
                                    Limpiar selección
                                </Button>
                            </div>
                        }
                    />
                </Tab>
                <Tab key="to" className=" text-tiny py-0" title="Antes de">
                    <Calendar
                        aria-label="Date (Presets)"
                        classNames={{
                            content: "w-full text-base",
                            base: "text-base",
                        }}
                        nextButtonProps={{
                            variant: "bordered",
                        }}
                        prevButtonProps={{
                            variant: "bordered",
                        }}
                        focusedValue={focusedTo}
                        onFocusChange={setFocusedTo}
                        value={to}
                        onChange={(e) => {
                            setTo(e);
                            handleSelectionChange(`t${formatToUTC(e, true)}`);
                        }}
                        bottomContent={
                            <div className="flex justify-center pb-3">
                                <Button
                                    variant="bordered"
                                    radius="full"
                                    className="h-8"
                                    onClick={() => {
                                        setTo(null);
                                        clearDataParam();
                                    }}
                                >
                                    Limpiar selección
                                </Button>
                            </div>
                        }
                    />
                </Tab>
            </Tabs>
        </div>
    );
}
