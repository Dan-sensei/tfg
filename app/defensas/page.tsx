import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	subMonths,
	addMonths,
	addDays,
	format,
} from "date-fns";
import CalendarControls from "./calendarControls";

const fetchDefensesForDate = async (date: Date): Promise<DefenseData[]> => {
	return [
		{
			title: "Example Defense",
			startTime: "10:00 AM",
			endTime: "11:00 AM",
			location: "Example Location",
		},
	];
};

interface DefenseData {
	title: string;
	startTime: string;
	endTime: string;
	location: string;
}

const getMonthDaysGrid = (date: Date) => {
	const startDay = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
	const endDay = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
	return eachDayOfInterval({ start: startDay, end: endDay });
};

type Props = {
	searchParams?: {
		year?: string;
		month?: string;
	};
};
export default function Defensas({ searchParams }: Props) {
	const now = new Date();
	const year = Number(searchParams?.year || now.getFullYear());
	const month = Number(searchParams?.month || now.getMonth());

	const getMonthDaysGrid = (date: Date) => {
		const startDay = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
		const endDay = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
		return eachDayOfInterval({ start: startDay, end: endDay });
	};

	const days = getMonthDaysGrid(new Date(year, month));
    const WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 pt-3">
			<div className="col-span-2">
				<CalendarControls year={year} month={month} />
				<div className="grid grid-cols-7  gap-2">
                    {WEEK.map((day, index) => (
                        <div key={index} className="p-4 text-center text-slate-300">{day}</div>
                    ))}
					{days.map((day, index) => (
						<div
							key={index}
							className={` p-4 text-center rounded-lg bg-slate-400/10 ${
								month !== day.getMonth()
									? "text-slate-500"
									: ""
							}`}
						>
							{format(day, "d")}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/*
<div className="flex-1">
				{selectedDate && (
					<div>
						<h3>Defenses for {format(selectedDate, "PP")}</h3>
						{defenses.map((defense, index) => (
							<div key={index}>
								<h4>{defense.title}</h4>
								<p>
									{defense.startTime} - {defense.endTime}
								</p>
								<p>{defense.location}</p>
							</div>
						))}
					</div>
				)}
			</div>
            */
