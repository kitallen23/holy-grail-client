import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/ui/table";
import type { Rune, SetItem, UniqueItem } from "@/types/items";
import type { GrailProgressItem } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";
import type { RowData } from "./types";
import { buildTableRows } from "./utils";

interface GrailStatsTableProps {
    uniqueItems: Record<string, UniqueItem>;
    setItems: Record<string, SetItem>;
    runes: Record<string, Rune>;
    grailProgress: Record<string, GrailProgressItem>;
}

export default function GrailStatsTable({
    uniqueItems,
    setItems,
    runes,
    grailProgress,
}: GrailStatsTableProps) {
    const tableRows: RowData[] = useMemo(
        () => buildTableRows(uniqueItems, setItems, runes, grailProgress),
        [uniqueItems, setItems, runes, grailProgress]
    );
    const totalFound = tableRows.reduce((acc, curr) => (acc += curr.found), 0);
    const totalItems = tableRows.reduce((acc, curr) => (acc += curr.total), 0);
    const totalPercentage = Math.round((totalFound / totalItems) * 100);

    return (
        <div>
            <Table>
                <TableCaption className="sr-only">
                    A list of statistics of your holy grail progress.
                </TableCaption>
                <TableBody>
                    {tableRows.map(row => (
                        <TableRow key={row.title}>
                            <TableCell className="font-medium">{row.title}</TableCell>
                            <TableCell className="w-28">
                                <div className="grid grid-cols-[1fr_auto_auto] gap-1">
                                    <div className="text-right">{row.found}</div>
                                    <div>/</div>
                                    <div className="w-10">{row.total}</div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right w-14 sm:w-22 font-bold">
                                {row.percentage}%
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Progress value={totalPercentage} className="mt-4" />

            <div className="relative">
                {totalPercentage < 20 ? (
                    <div className="font-diablo text-primary text-lg text-left">
                        {totalPercentage}%
                    </div>
                ) : (
                    <div
                        className="font-diablo text-primary text-lg text-right"
                        style={{ transform: `translateX(-${100 - (totalPercentage || 0)}%)` }}
                    >
                        {totalPercentage}%
                    </div>
                )}
            </div>
        </div>
    );
}
