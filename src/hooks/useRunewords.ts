import { useState, useEffect } from "react";
import { fetchAllRunewords } from "../lib/itemService";
import type { Runewords } from "@/types/items";

export const useRunewords = () => {
    const [runewords, setRunewords] = useState<Runewords | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRunewords = async () => {
            try {
                const data = await fetchAllRunewords();
                setRunewords(data?.runewords);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch runewords");
            } finally {
                setLoading(false);
            }
        };

        loadRunewords();
    }, []);

    return { data: runewords, loading, error };
};
