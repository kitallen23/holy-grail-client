import { useMemo, useRef, useEffect, useLayoutEffect, useState } from "react";
import MonthLabels from "./MonthLabels";
import HeatmapGrid from "./HeatmapGrid";

interface HeatmapData {
    date: string; // ISO date string
    count: number;
}

interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
    data: HeatmapData[];
    className?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DAYS_IN_WEEK = 7;

export default function Heatmap({ data, ...rest }: HeatmapProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [labelPositions, setLabelPositions] = useState<Record<string, number>>({});
    const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

        // Calculate month labels positions - only show when month dominates the week
        const monthLabels: { month: string; weekIndex: number }[] = [];
        let lastLabeledMonth = -1;

        for (let week = 0; week < totalWeeks; week++) {
            // Get all days in this week column
            const daysInWeek = cells.filter(cell => cell.gridColumn === week + 1);

            // Count days per month in this week
            const monthCounts = new Map<number, number>();
            daysInWeek.forEach(cell => {
                const date = new Date(cell.data.date);
                const month = date.getMonth();
                monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
            });

            // Find month that has all 7 days in this week
            const fullWeekMonth = Array.from(monthCounts.entries()).find(
                ([, count]) => count === 7
            )?.[0];

            // Add label if full week month exists and is different from previous week
            if (fullWeekMonth !== undefined && fullWeekMonth !== lastLabeledMonth) {
                monthLabels.push({
                    month: MONTHS[fullWeekMonth],
                    weekIndex: week,
                });
                lastLabeledMonth = fullWeekMonth;
            }
        }

        return { cells, monthLabels, totalWeeks };
    }, [data]);

    // Measure and calculate label positions after render
    useLayoutEffect(() => {
        const newPositions: Record<string, number> = {};

        const gridContainer = scrollContainerRef.current?.querySelector(".grid.h-4") as HTMLElement;

        if (gridContainer) {
            const actualContainerWidth = gridContainer.getBoundingClientRect().width;
            const actualColumnWidth = actualContainerWidth / totalWeeks;

            monthLabels.forEach(({ month, weekIndex }) => {
                const labelElement = labelRefs.current[`${month}-${weekIndex}`];
                if (labelElement) {
                    const textWidth = labelElement.scrollWidth;
                    const remainingWeeks = totalWeeks - weekIndex;
                    const availableWidth = remainingWeeks * actualColumnWidth;
                    const overflow = Math.max(0, textWidth - availableWidth);
                    newPositions[`${month}-${weekIndex}`] = overflow > 0 ? -overflow : 0;
                }
            });
        }

        setLabelPositions(newPositions);
    }, [monthLabels, totalWeeks]);

    // Auto-scroll to the right (most recent data) on mount and data changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
    }, [data]);

    return (
        <div {...rest} aria-hidden="true">
            <div ref={scrollContainerRef} className="overflow-x-auto">
                <div className="flex flex-col gap-2 min-w-lg">
                    <MonthLabels
                        monthLabels={monthLabels}
                        totalWeeks={totalWeeks}
                        labelPositions={labelPositions}
                        labelRefs={labelRefs}
                    />

                    <HeatmapGrid cells={cells} totalWeeks={totalWeeks} />
                </div>
            </div>
        </div>
    );
}
