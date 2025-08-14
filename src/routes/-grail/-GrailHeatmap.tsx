import { useMemo } from "react";
import Heatmap from "@/components/Heatmap";
import { useGrailData } from "@/hooks/useGrailData";

function GrailHeatmap() {
    const { items: grailProgress, isFetching: isFetchingGrailProgress } = useGrailData();

    const heatmapData = useMemo(() => {
        if (!grailProgress) return [];

        // Group items by date and count them
        const dateCountMap = new Map<string, number>();

        Object.values(grailProgress).forEach(item => {
            if (item.found && item.foundAt) {
                // Convert ISO string to local date to avoid timezone issues
                const foundDate = new Date(item.foundAt);
                const localDateKey = `${foundDate.getFullYear()}-${String(foundDate.getMonth() + 1).padStart(2, "0")}-${String(foundDate.getDate()).padStart(2, "0")}`;
                const currentCount = dateCountMap.get(localDateKey) || 0;
                dateCountMap.set(localDateKey, currentCount + 1);
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

    return <Heatmap className="mx-auto max-w-xl w-full" data={heatmapData} />;
}

export default GrailHeatmap;
