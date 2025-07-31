import { useGrailProgress } from "@/hooks/queries";
import { useGrailProgressStore } from "@/stores/useGrailProgressStore";
import { useEffect, useMemo } from "react";
import Heatmap from "@/components/Heatmap";

function GrailHeatmap() {
    const { data: _grailProgress, isFetching: isFetchingGrailProgress } = useGrailProgress();

    const { items: grailProgress, setItems: setGrailItems } = useGrailProgressStore();

    useEffect(() => {
        if (_grailProgress && !grailProgress) {
            setGrailItems(_grailProgress);
        }
    }, [_grailProgress, grailProgress]);

    const heatmapData = useMemo(() => {
        if (!grailProgress) return [];

        // Group items by date and count them
        const dateCountMap = new Map<string, number>();

        Object.values(grailProgress).forEach(item => {
            if (item.found && item.foundAt) {
                // Extract date part (YYYY-MM-DD) from ISO string
                const dateKey = item.foundAt.split("T")[0];
                const currentCount = dateCountMap.get(dateKey) || 0;
                dateCountMap.set(dateKey, currentCount + 1);
            }
        });

        // Convert to array format expected by Heatmap component
        return Array.from(dateCountMap.entries()).map(([date, count]) => ({
            date,
            count,
        }));
    }, [grailProgress]);

    if (isFetchingGrailProgress) {
        return null;
    }

    return (
        <div>
            <Heatmap className="mx-auto" data={heatmapData} color="primary" />
        </div>
    );
}

export default GrailHeatmap;
