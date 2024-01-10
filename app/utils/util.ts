export const encodeForUrl = (text: string) =>
    encodeURI(text.replaceAll(" ", "-"));

export const formatViews = (num: number): string => {
    if (num >= 1000000) {
        const milions = parseFloat((num / 1000000).toFixed(1));
        return milions + "M";
    } 
    else if (num >= 1000) {
        const thousands = parseFloat((num / 1000).toFixed(1));
        return thousands + "k";
    } 
    else {
        return num.toString();
    }
};
