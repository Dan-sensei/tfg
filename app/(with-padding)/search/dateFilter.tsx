"use client";
import { useEffect, useState } from "react";
import { Calendar, RangeCalendar, RangeValue } from "@nextui-org/calendar";

import type { DateValue } from "@react-types/calendar";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { parseDate } from "@internationalized/date";
import { QueryParams } from "@/app/types/interfaces";

interface PopularTagsProps {
    filters: QueryParams;
    updateFilters: (newFilters: { [key: string]: string | undefined }) => void;
}
export default function DateFilter({
    filters,
    updateFilters,
}: PopularTagsProps) {
    const [selectedTab, setSelectedTab] = useState("from");
    const [from, setFrom] = useState<DateValue | null>(null);
    const [focusedFrom, setFocusedFrom] = useState<DateValue | undefined>(
        undefined
    );
    const [to, setTo] = useState<DateValue | null>(null);
    const [focusedTo, setFocusedTo] = useState<DateValue | undefined>(
        undefined
    );

    const [rangeValue, setRangeValue] = useState<RangeValue<DateValue> | null>(
        null
    );

    let [focusedRangeValue, setFocusedRangeValue] = useState<
        DateValue | undefined
    >(undefined);

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
        if (filters.fromdate && !filters.todate) {
            const fromdate = filters.fromdate;
            setSelectedTab("from");
            setFocusedFrom(parseDate(fromdate));
            setFrom(parseDate(fromdate));
        } else if (!filters.fromdate && filters.todate) {
            const todate = filters.todate;
            setSelectedTab("to");
            setTo(parseDate(todate));
            setFocusedTo(parseDate(todate));
        } else if (filters.fromdate && filters.todate) {
            setSelectedTab("between");
            setRangeValue({
                start: parseDate(filters.fromdate),
                end: parseDate(filters.todate),
            });
        } else {
            setFrom(null);
            setTo(null);
            setRangeValue(null);
        }
    }, [filters.fromdate, filters.todate]);

    const clearDataParam = () => {
        updateFilters({
            fromdate: undefined,
            todate: undefined,
        });
    };

    const handleTabChange = (key: React.Key) => {
        setSelectedTab(key.toString());
        if (key === "from" && from) {
            updateFilters({
                fromdate: `${formatToUTC(from)}`,
                todate: undefined,
            });
        } else if (key === "to" && to) {
            updateFilters({
                fromdate: undefined,
                todate: `${formatToUTC(to, true)}`,
            });
        } else if (key === "between" && rangeValue) {
            updateFilters({
                fromdate: formatToUTC(rangeValue.start),
                todate: formatToUTC(rangeValue.end, true),
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
                    base: "w-full px-4",
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
                            updateFilters({
                                fromdate: formatToUTC(e),
                            });
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
                            updateFilters({
                                fromdate: formatToUTC(e.start),
                                todate: formatToUTC(e.end, true),
                            });
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
                            updateFilters({
                                todate: formatToUTC(e, true),
                            });
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
