import { useMemo, useRef, useEffect } from "react";
import { clsx } from "clsx";

interface HeatmapData {
    date: string; // ISO date string
    count: number;
}

interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
    data: HeatmapData[];
    color?: string;
    className?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DAYS_IN_WEEK = 7;

export default function Heatmap({ data, color = "primary", ...rest }: HeatmapProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { cells, monthLabels, totalWeeks } = useMemo(() => {
        // Create a map of date -> count for quick lookup
        const dataMap = new Map<string, number>();
        data.forEach(item => {
            // Ensure we're using the date as-is (already in local timezone format from GrailHeatmap)
            const dateKey = item.date.includes("T") ? item.date.split("T")[0] : item.date;
            dataMap.set(dateKey, item.count);
        });

        // Calculate date range: last 12 months ending today
        const today = new Date();
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const rawStartDate = new Date(today.getFullYear(), today.getMonth() - 11, today.getDate());

        // Find Monday of the week containing the raw start date
        const rawStartDayOfWeek = (rawStartDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
        const startDate = new Date(rawStartDate);
        startDate.setDate(rawStartDate.getDate() - rawStartDayOfWeek); // Go back to Monday

        // Calculate total days in the range (from Monday of first week to today)
        const totalDays =
            Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Calculate total weeks needed
        const totalWeeks = Math.ceil(totalDays / DAYS_IN_WEEK);

        // Create flat array of cells with grid positions
        const cells: Array<{
            data: HeatmapData;
            gridColumn: number;
            gridRow: number;
        }> = [];

        for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + dayIndex);
            // Use local date formatting to avoid timezone conversion issues
            const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
            const count = dataMap.get(dateKey) || 0;

            const week = Math.floor(dayIndex / DAYS_IN_WEEK);
            const dayOfWeek = dayIndex % DAYS_IN_WEEK;

            cells.push({
                data: {
                    date: dateKey,
                    count,
                },
                gridColumn: week + 1,
                gridRow: dayOfWeek + 1,
            });
        }

        // Calculate month labels positions
        const monthLabels: { month: string; weekIndex: number }[] = [];
        let currentMonth = -1;

        for (let week = 0; week < totalWeeks; week++) {
            const firstDayOfWeek = cells.find(cell => cell.gridColumn === week + 1);
            if (firstDayOfWeek) {
                const date = new Date(firstDayOfWeek.data.date);
                const month = date.getMonth();

                if (month !== currentMonth) {
                    monthLabels.push({
                        month: MONTHS[month],
                        weekIndex: week,
                    });
                    currentMonth = month;
                }
            }
        }

        return { cells, monthLabels, totalWeeks };
    }, [data]);

    const getIntensityClass = (count: number): string => {
        if (count === 0) return "bg-surface";
        if (count === 1) return `bg-${color}/20`;
        if (count === 2) return `bg-${color}/40`;
        if (count === 3) return `bg-${color}/60`;
        if (count === 4) return `bg-${color}/80`;
        return `bg-${color}`;
    };

    // Auto-scroll to the right (most recent data) on mount and data changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
    }, [data]);

    return (
        <div {...rest}>
            <div ref={scrollContainerRef} className="overflow-x-auto">
                <div className="flex flex-col gap-2" style={{ minWidth: "512px" }}>
                    {/* Month labels */}
                    <div
                        className="grid h-4"
                        style={{
                            gridTemplateColumns: `repeat(${totalWeeks}, minmax(8px, 1fr))`,
                        }}
                    >
                        {monthLabels.map(({ month, weekIndex }) => (
                            <div
                                key={`${month}-${weekIndex}`}
                                className="text-xs text-muted-foreground"
                                style={{
                                    gridColumn: weekIndex + 1,
                                }}
                            >
                                {month}
                            </div>
                        ))}
                    </div>

                    {/* Heatmap grid */}
                    <div
                        className="grid gap-[2px]"
                        style={{
                            gridTemplateColumns: `repeat(${totalWeeks}, minmax(8px, 1fr))`,
                            gridTemplateRows: `repeat(${DAYS_IN_WEEK}, minmax(8px, 1fr))`,
                            aspectRatio: `${totalWeeks} / ${DAYS_IN_WEEK}`,
                        }}
                    >
                        {cells.map(({ data, gridColumn, gridRow }) => (
                            <div
                                key={data.date}
                                className={clsx(
                                    "aspect-square rounded-xs",
                                    getIntensityClass(data.count)
                                )}
                                style={{
                                    gridColumn,
                                    gridRow,
                                }}
                                title={`${data.date}: ${data.count} items`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
