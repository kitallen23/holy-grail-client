import { useState, useEffect } from "react";
import { fetchAllItems } from "../lib/itemService";
import type { Items } from "@/types/items";

export const useItems = () => {
    const [items, setItems] = useState<Items | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const data = await fetchAllItems();
                setItems(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch items");
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    return { data: items, loading, error };
};
