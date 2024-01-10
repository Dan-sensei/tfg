export const sanitizeString = (str: string) => {
    str = str.trim()
    str = str.toLocaleLowerCase()
    str = str.replace(/\s+/g, '-')
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    str = str.replace(/[^a-zA-Z0-9-]/g, '')
    return str
}
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
