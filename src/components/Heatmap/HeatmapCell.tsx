import { clsx } from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HeatmapData {
    date: string;
    count: number;
}

interface HeatmapCellProps {
    data: HeatmapData;
    gridColumn: number;
    gridRow: number;
}

export default function HeatmapCell({ data, gridColumn, gridRow }: HeatmapCellProps) {
    const getIntensityClass = (count: number): string => {
        if (count === 0) return "bg-surface";
        if (count === 1) return `bg-primary/20`;
        if (count === 2) return `bg-primary/40`;
        if (count === 3) return `bg-primary/60`;
        if (count === 4) return `bg-primary/80`;
        return `bg-primary`;
    };

    const formatDateForDisplay = (dateString: string): string => {
        // Parse the YYYY-MM-DD string as a local date (not UTC)
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day); // month is 0-indexed
        return date.toLocaleDateString();
    };

    return (
        <Tooltip delayDuration={400}>
            <TooltipTrigger asChild>
                <div
                    className={clsx("aspect-square rounded-xs", getIntensityClass(data.count))}
                    style={{
                        gridColumn,
                        gridRow,
                    }}
                />
            </TooltipTrigger>

            <TooltipContent>
                {formatDateForDisplay(data.date)}: {data.count} items
            </TooltipContent>
        </Tooltip>
    );
}
