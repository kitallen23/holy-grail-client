import HeatmapCell from "./HeatmapCell";

interface HeatmapData {
    date: string;
    count: number;
}

interface HeatmapCell {
    data: HeatmapData;
    gridColumn: number;
    gridRow: number;
}

interface HeatmapGridProps {
    cells: HeatmapCell[];
    totalWeeks: number;
}

const DAYS_IN_WEEK = 7;

export default function HeatmapGrid({ cells, totalWeeks }: HeatmapGridProps) {
    return (
        <div
            className="grid gap-[2px]"
            style={{
                gridTemplateColumns: `repeat(${totalWeeks}, minmax(8px, 1fr))`,
                gridTemplateRows: `repeat(${DAYS_IN_WEEK}, minmax(8px, 1fr))`,
                aspectRatio: `${totalWeeks} / ${DAYS_IN_WEEK}`,
            }}
        >
            {cells.map(({ data, gridColumn, gridRow }) => (
                <HeatmapCell
                    key={data.date}
                    data={data}
                    gridColumn={gridColumn}
                    gridRow={gridRow}
                />
            ))}
        </div>
    );
}
