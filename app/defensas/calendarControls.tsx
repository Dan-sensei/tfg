"use client";

import { addMonths, format, subMonths } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { es } from "date-fns/locale";

type Props = {
	year: number;
	month: number;
};

type CalendarButtonControl = {
	active?: boolean;
	label: string;
	updateMonths: number;
};
export default function CalendarControls({ year, month }: Props) {
	const pathname = usePathname();
	const { replace } = useRouter();
	const activeDate = new Date(year, month);
	const updateRouter = (increment: number) => {
		const newDate = addMonths(activeDate, increment);
		const params = new URLSearchParams({
			year: newDate.getFullYear().toString(),
			month: newDate.getMonth().toString(),
		});
		replace(`${pathname}?${params.toString()}`);
	};

	const buttons: CalendarButtonControl[] = [
		{
			label: format(subMonths(activeDate, 2), "MMMM", {
				locale: es,
			}).toUpperCase(),
			updateMonths: -2,
		},
		{
			label: format(subMonths(activeDate, 1), "MMMM", {
				locale: es,
			}).toUpperCase(),
			updateMonths: -1,
		},
		{
			active: true,
			label: format(activeDate, "MMMM", {
				locale: es,
			}).toUpperCase(),
			updateMonths: 0,
		},
		{
			label: format(addMonths(activeDate, 1), "MMMM", {
				locale: es,
			}).toUpperCase(),
			updateMonths: -1,
		},
		{
			label: format(addMonths(activeDate, 2), "MMMM", {
				locale: es,
			}).toUpperCase(),
			updateMonths: -2,
		},
	];

	return (
		<>
			<div className="grid grid-cols-5 text-center">
				{buttons.map((button, index) =>
					button.active ? (
						<div key={index} className="text-xl">{button.label}</div>
					) : (
						<button
							key={index}
							onClick={() => updateRouter(button.updateMonths)}
							className={`${"text-slate-400 hover:text-slate-200 transition-colors"}`}
						>
							{button.label}
						</button>
					)
				)}
			</div>
		</>
	);
}
