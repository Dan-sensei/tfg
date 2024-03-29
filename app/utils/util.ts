export const sanitizeString = (str: string) => {
    str = str.trim();
    str = str.toLocaleLowerCase();
    str = str.replace(/\s+/g, "-");
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/[^a-zA-Z0-9-]/g, "");
    return str;
};
export const formatViews = (num: number): string => {
    if (num >= 1000000) {
        const milions = parseFloat((num / 1000000).toFixed(1));
        return milions + "M";
    } else if (num >= 1000) {
        const thousands = parseFloat((num / 1000).toFixed(1));
        return thousands + "k";
    } else {
        return num.toString();
    }
};

export const emblaNoDragLogic = (_: any, event: MouseEvent | TouchEvent) => {
    if (
        event.target instanceof Element &&
        event.target.closest(".embla_nodrag")
    ) {
        return false;
    }
    return true;
};

export const convertDateToUTC = (date: Date) => {
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
};

export const startOfWeekUTC = (date: Date) => {
    let tempDate = new Date(date.getTime());
    const dayOfWeek = tempDate.getUTCDay();
    const diff = (dayOfWeek + 6) % 7;
    tempDate.setUTCDate(tempDate.getUTCDate() - diff);
    tempDate.setUTCHours(0, 0, 0, 0);
    return tempDate;
};

export const startOfMonthUTC = (date: Date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth()));
};

export const endOfMonthUTC = (date: Date) => {
    let tempDate = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)
    );
    tempDate.setUTCMilliseconds(-1);
    return tempDate;
};

export const endOfWeekUTC = (date: Date) => {
    let tempDate = new Date(date.getTime());
    const dayOfWeek = tempDate.getUTCDay();
    const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    tempDate.setUTCDate(tempDate.getUTCDate() + diff);
    tempDate.setUTCHours(23, 59, 59, 999);
    return tempDate;
};

export const eachDayOfIntervalUTC = (start: Date, end: Date) => {
    let daysArray = [];
    let currentDate = new Date(
        Date.UTC(
            start.getUTCFullYear(),
            start.getUTCMonth(),
            start.getUTCDate()
        )
    );

    const endDate = new Date(
        Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
    );

    while (currentDate <= endDate) {
        daysArray.push(new Date(currentDate));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return daysArray;
}

export const convertUTCDateToLocalDateKey = (utcDateString: string) => {
    const date = new Date(utcDateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }