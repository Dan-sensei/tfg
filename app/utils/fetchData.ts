import { getApiRouteUrl } from "./util";

export const fetchData = async (url: string, params?: URLSearchParams | null, revalidate?: number) => {
    let options = null;
    if(revalidate) {
        options = {
            next: {
                revalidate: revalidate
            }
        }
    }
    const response = await fetch(getApiRouteUrl(url, params), {
        ...options
    });

    if (!response.ok) {
        throw new Error("Not found");
    }
    return response.json();
};