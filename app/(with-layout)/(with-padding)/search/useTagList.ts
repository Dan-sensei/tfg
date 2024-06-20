import { useEffect, useState } from "react";

export function useTagsList(searchQuery: string) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/tags?q=${searchQuery}`);
                const data = await res.json();
                setItems(data.response.map((tag: string) => ({ name: tag })));
            } catch (error) {
                console.error("Error fetching tags:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (searchQuery) {
            fetchData();
        }
    }, [searchQuery]);

    return {
        items,
        isLoading
    };
};
