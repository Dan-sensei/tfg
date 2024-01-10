
export const encodeForUrl = (text: string) => encodeURI(text.replaceAll(' ', '-'))