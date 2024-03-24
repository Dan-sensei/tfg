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
import { bebas_Neue, tulpen_one } from "../components/fonts";

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
    const WEEK = ["L", "M", "X", "J", "V", "S", "D"];
	
	const corners: { [key: number]: string } = {
		0:  'rounded-tl-lg lg:rounded-tl-2xl',
		6:  'rounded-tr-lg lg:rounded-tr-2xl',
		28: 'rounded-bl-lg lg:rounded-bl-2xl',
		34: 'rounded-br-lg lg:rounded-br-2xl',
	}
    return (
        <div className="xl:container mx-auto h-full min-h-[500px]">
            <div className="grid grid-cols-1 xl:grid-cols-3 pt-3 h-full">
                <div className="col-span-2 flex flex-col lg:max-h-[1000px] pb-5">
                    <CalendarControls year={year} month={month} />
					<div className="flex">
						{WEEK.map((day, index) => (
                            <div
                                key={index}
                                className="w-full p-4 text-center text-slate-300"
                            >
                                {day}
                            </div>
                        ))}
					</div>
                    <div className={`${bebas_Neue.className} gap-[2px] grid grid-cols-7 text-xl lg:text-4xl lg:flex-1 rounded-2xl`}>
                        
                        {days.map((day, index) => (
                            <button
                                key={index}
                                className={`${corners[index]} p-4 flex items-center justify-center aspect-square lg:aspect-auto transition-colors ${
                                    month !== day.getMonth()
                                        ? "text-slate-400 bg-nova-light/10 hover:bg-nova-light/20"
                                        : "text-nova-link bg-nova-light2/30 hover:bg-nova-light2/50"
                                }`}
                            >
                                {format(day, "d")}
                            </button>
                        ))}
                    </div>
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
