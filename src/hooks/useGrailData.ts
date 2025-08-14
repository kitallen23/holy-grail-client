import { useEffect } from "react";
import { useGrailProgress } from "@/hooks/queries";
import { useGrailProgressStore } from "@/stores/useGrailProgressStore";
import { useAuth } from "@/hooks/useAuth";

export const useGrailData = () => {
    const { user } = useAuth();
    const {
        data: _grailProgress,
        isFetching,
        error,
    } = useGrailProgress({
        enabled: !!user?.email,
    });

    const { items, setItems: setGrailItems } = useGrailProgressStore();

    // Sync React Query data to Zustand store
    useEffect(() => {
        if (_grailProgress && !items) {
            setGrailItems(_grailProgress);
        }
    }, [_grailProgress, items, setGrailItems]);

    return {
        items,
        isFetching,
        error,
    };
};
