import { useState, useEffect } from "react";
import { fetchGrailProgress } from "../lib/itemService";
import type { GrailProgressItem } from "@/lib/api";

export const useGrailProgress = () => {
    const [grailProgress, setGrailProgress] = useState<Record<string, GrailProgressItem> | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const data = await fetchGrailProgress();
                setGrailProgress(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch grail progress");
            } finally {
                setLoading(false);
            }
        };

        loadProgress();
    }, []);

    return { data: grailProgress, loading, error };
};
