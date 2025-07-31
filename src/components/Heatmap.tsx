import { useMemo } from "react";
import { clsx } from "clsx";

interface HeatmapData {
    date: string; // ISO date string
    count: number;
}

interface HeatmapProps {
    data: HeatmapData[];
    color?: string;
    className?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DAYS_IN_WEEK = 7;

export default function Heatmap({ data, color = "primary", className }: HeatmapProps) {
    const { grid, monthLabels } = useMemo(() => {
        // Create a map of date -> count for quick lookup
        const dataMap = new Map<string, number>();
        data.forEach(item => {
            const dateKey = item.date.split("T")[0]; // Get YYYY-MM-DD part
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

        // Since we start on Monday, startDayOfWeek is always 0
        const startDayOfWeek = 0;

        // Calculate total weeks needed
        const totalWeeks = Math.ceil(totalDays / DAYS_IN_WEEK);

        // Create the grid
        const grid: (HeatmapData | null)[][] = [];
        for (let week = 0; week < totalWeeks; week++) {
            const weekData: (HeatmapData | null)[] = [];
            for (let day = 0; day < DAYS_IN_WEEK; day++) {
                const dayIndex = week * DAYS_IN_WEEK + day - startDayOfWeek;

                if (dayIndex < 0 || dayIndex >= totalDays) {
                    weekData.push(null); // Empty space
                } else {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + dayIndex);
                    const dateKey = currentDate.toISOString().split("T")[0];
                    const count = dataMap.get(dateKey) || 0;

                    weekData.push({
                        date: dateKey,
                        count,
                    });
                }
            }
            grid.push(weekData);
        }

        // Calculate month labels positions
        const monthLabels: { month: string; weekIndex: number }[] = [];
        let currentMonth = -1;

        for (let week = 0; week < totalWeeks; week++) {
            const firstDayOfWeek = grid[week].find(day => day !== null);
            if (firstDayOfWeek) {
                const date = new Date(firstDayOfWeek.date);
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

        return { grid, monthLabels };
    }, [data]);

    const getIntensityClass = (count: number): string => {
        if (count === 0) return "bg-surface";
        if (count === 1) return `bg-${color}/20`;
        if (count === 2) return `bg-${color}/40`;
        if (count === 3) return `bg-${color}/60`;
        if (count === 4) return `bg-${color}/80`;
        return `bg-${color}`;
    };

    return (
        <div className={clsx("w-lg", className)}>
            {/* Scrollable container */}
            <div className="overflow-x-auto">
                <div className="flex flex-col gap-2 min-w-fit">
                    {/* Month labels */}
                    <div className="relative h-4">
                        {monthLabels.map(({ month, weekIndex }) => (
                            <div
                                key={`${month}-${weekIndex}`}
                                className="absolute text-xs text-muted-foreground"
                                style={{
                                    left: `${weekIndex * 14}px`, // 12px square + 2px gap
                                    top: 0,
                                }}
                            >
                                {month}
                            </div>
                        ))}
                    </div>

                    {/* Heatmap grid */}
                    <div className="flex gap-0.5">
                        {grid.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-0.5">
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={`${weekIndex}-${dayIndex}`}
                                        className={clsx(
                                            "w-3 h-3 rounded-sm",
                                            day ? getIntensityClass(day.count) : "transparent"
                                        )}
                                        title={day ? `${day.date}: ${day.count} items` : undefined}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
