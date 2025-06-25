import { useMemo } from "react";
import type { Runeword, RunewordBaseType, Runewords } from "@/types/items";
import HeadingSeparator from "@/components/HeadingSeparator";
import { Button } from "@/components/ui/button";

interface RunewordArrayItem extends Runeword {
    key: string;
}

function getFilteredRunewords(data: Runewords | null, type: RunewordBaseType): RunewordArrayItem[] {
    if (!data) {
        return [];
    }

    const categoryRunewords = Object.entries(data)
        .map(([key, value]) => ({
            ...value,
            key,
        }))
        .filter(item => item.type === type);

    return categoryRunewords;
}

interface RunewordCategoryProps {
    data: Runewords | null;
    category: RunewordBaseType;
    label: string;
}

export default function RunewordCategory({ data, category, label }: RunewordCategoryProps) {
    const displayedRunewords = useMemo(() => getFilteredRunewords(data, category), [data]);

    return (
        <>
            <HeadingSeparator>{label}</HeadingSeparator>
            <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {displayedRunewords.map(runeword => (
                    <Button
                        variant="ghost"
                        color="primary"
                        size="sm"
                        key={runeword.key}
                        className="justify-start"
                    >
                        {/* <Dot /> */}
                        <div className="text-nowrap">{runeword.name}</div>
                        <div className="pl-0 sm:pl-1 text-foreground/60 truncate">
                            {runeword.itemTypes.join(", ")} ({runeword.sockets})
                        </div>
                    </Button>
                ))}
            </div>
        </>
    );
}
