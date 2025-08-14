interface MonthLabel {
    month: string;
    weekIndex: number;
}

interface MonthLabelsProps {
    monthLabels: MonthLabel[];
    totalWeeks: number;
    labelPositions: Record<string, number>;
    labelRefs: { current: Record<string, HTMLDivElement | null> };
}

export default function MonthLabels({
    monthLabels,
    totalWeeks,
    labelPositions,
    labelRefs,
}: MonthLabelsProps) {
    return (
        <div
            className="grid h-4"
            style={{
                gridTemplateColumns: `repeat(${totalWeeks}, minmax(8px, 1fr))`,
            }}
        >
            {monthLabels.map(({ month, weekIndex }) => {
                const labelKey = `${month}-${weekIndex}`;
                const leftOffset = labelPositions[labelKey] || 0;

                return (
                    <div
                        key={labelKey}
                        ref={el => {
                            labelRefs.current[labelKey] = el;
                        }}
                        className="text-xs text-muted-foreground select-none cursor-default"
                        style={{
                            gridColumn: weekIndex + 1,
                            transform: `translateX(${leftOffset}px)`,
                        }}
                    >
                        {month}
                    </div>
                );
            })}
        </div>
    );
}
