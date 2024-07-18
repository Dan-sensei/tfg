import { NextResponse } from "next/server";

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
    if (event.target instanceof Element && event.target.closest(".embla_nodrag")) {
        return false;
    }
    return true;
};

export const convertDateToUTC = (date: Date) => {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
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
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth()));
};

export const endOfMonthUTC = (date: Date) => {
    let tempDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
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
    let currentDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));

    const endDate = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));

    while (currentDate <= endDate) {
        daysArray.push(new Date(currentDate));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return daysArray;
};

export const convertUTCDateToLocalDateKey = (utcDateString: string) => {
    const date = new Date(utcDateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const HTTPResponse = (success: boolean, responseData: string, statusCode: number) => {
    return NextResponse.json(
        { success: success, response: responseData },
        {
            status: statusCode,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};

export const badResponse = (errorMessage: string, statusCode: number = 400) => {
    return HTTPResponse(false, errorMessage, statusCode);
};

export const successResponse = (data: any, statusCode: number = 200) => {
    return HTTPResponse(true, data, statusCode);
};

export const getValidLimit = (param: string | null, minLimit: number = 1, maxLimit: number = 20) => {
    const parsedLimit = parseInt(param || "", 10);

    if (isNaN(parsedLimit)) {
        return minLimit;
    }

    return Math.min(Math.max(parsedLimit, minLimit), maxLimit);
};

export const getApiRouteUrl = (endpoint: string, searchParams?: URLSearchParams | null) => {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/${endpoint}`;
    if (searchParams) {
        url += `?${searchParams.toString()}`;
    }
    return url;
};

export const sameArrays = (a: any[], b: any[]) => {
    if (a.length !== b.length) {
        return false;
    }
    let sorted_a = a.slice().sort();
    let sorted_b = b.slice().sort();
    for (let i = 0; i < sorted_a.length; i++) {
        if (sorted_a[i] !== sorted_b[i]) {
            return false;
        }
    }
    return true;
};

export const isNullOrEmpty = (str: string | null) => str == null || str.trim() === "";

export const toFirstLetterUppercase = (str: string) => str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

export const roundTwoDecimals = (number: number) => Math.round((number + Number.EPSILON) * 100) / 100;
export const blobToBase64 = (blob: Blob): Promise<string> => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            if (reader.result) {
                resolve(reader.result.toString());
            } else {
                reject();
            }
        };
    });
};

export const getFileType = (mimeType: string): string => {
    const parts = mimeType.split("/");
    if (parts.length > 1) {
        return parts[1].toUpperCase();
    }
    return mimeType;
};

export const getYoutubeVideoId = (url: string) => {
    const regex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/(?:[^\/\n\s]+\/|)|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^#&?\/\n\s]{11})/;
    const match = url.match(regex);
    if (match) {
        return match[1];
    } else {
        return null;
    }
};

export const normalizeText = (text: string) => {
    text = text.normalize("NFD");
    // Keep ñ
    text = text.replace(/n\u0303/g, "ñ");
    // Remove accents
    text = text.replace(/[\u0300-\u036f]/g, "");
    text = text.toLowerCase();
    text = text.replace(/[^a-z0-9ñ']/g, " ");
    // Multiple spaces -> single space
    text = text.replace(/\s+/g, " ").trim();
    return text;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getBasePathNameUntilId = (path: string, id: string) => {
    const parts = path.split("/");
    const index = parts.indexOf(id);
    if (index === -1) {
        return path;
    }
    return parts.slice(0, index + 1).join("/");
};

export const getPreferredLocale = (acceptLanguageHeader: string) => {
    const languages = acceptLanguageHeader.split(",").map((lang) => {
        const parts = lang.split(";q=");
        return { lang: parts[0], quality: parts[1] ? parseFloat(parts[1]) : 1.0 };
    });

    // Sort languages by quality score in descending order
    languages.sort((a, b) => b.quality - a.quality);

    // Find the first language with a region
    for (const language of languages) {
        if (language.lang.includes("-")) {
            return language.lang;
        }
    }

    // Fallback to the first language if no region-specific language is found
    return languages[0].lang;
}
