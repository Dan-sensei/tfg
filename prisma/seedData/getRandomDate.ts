import { setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";

const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomTime = (date: Date): [Date, Date] => {
    const startHour = randomInRange(8, 16);
    const endHour = startHour + randomInRange(1, 3);

    const startTime = setMilliseconds(setSeconds(setMinutes(setHours(date, startHour), 0), 0), 0);
    const endTime = setMilliseconds(setSeconds(setMinutes(setHours(date, endHour), 0), 0), 0);

    return [startTime, endTime];
};

export const getRandomDates = (startDate: Date, endDate: Date) => {
    const dates = [];
    const currentDate = startDate;

    while (currentDate <= endDate) {
        if (Math.random() < 0.4) {
            for (let i = 0; i < randomInRange(1, 3); i++) {
                dates.push(getRandomTime(currentDate));
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates.map(([startTime, endTime]) => ({ startTime, endTime }));
};
