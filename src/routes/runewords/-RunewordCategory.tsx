import { useMemo } from "react";

import type { Runeword, RunewordBaseType, Runewords } from "@/types/items";
import HeadingSeparator from "@/components/HeadingSeparator";
import { Button } from "@/components/ui/button";
import type { WithKey } from "@/routes/items/-types";
import clsx from "clsx";

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
        .filter(item => item.type === type)
        .sort((a, b) => (a.name > b.name ? 1 : 0));

    return categoryRunewords;
}

interface RunewordCategoryProps {
    data: Runewords | null;
    category: RunewordBaseType;
    label: string;
    selectedRuneword?: WithKey<Runeword> | null;
    onClick: (runeword: RunewordArrayItem | null) => void;
}

export default function RunewordCategory({
    data,
    category,
    label,
    selectedRuneword,
    onClick,
}: RunewordCategoryProps) {
    const displayedRunewords = useMemo(() => getFilteredRunewords(data, category), [data]);

    const handleRunewordClick = (runeword: RunewordArrayItem) => {
        if (selectedRuneword) {
            onClick(null);
        } else {
            onClick(runeword);
        }
    };

    if (!displayedRunewords.length) {
        return null;
    }

    return (
        <>
            <HeadingSeparator className="text-primary">{label}</HeadingSeparator>
            <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {displayedRunewords.map(runeword => (
                    <Button
                        key={runeword.key}
                        variant="ghost"
                        size="sm"
                        className={clsx(
                            "runeword-trigger justify-start border border-transparent inline-flex w-fit max-w-full",
                            runeword.key === selectedRuneword?.key ? "border-primary" : ""
                        )}
                        onClick={() => handleRunewordClick(runeword)}
                        aria-haspopup="dialog"
                        aria-label={`View details for ${runeword.name}`}
                    >
                        <div className="text-nowrap truncate">{runeword.name}</div>
                        <div className="pl-0 sm:pl-1 text-foreground/60 truncate">
                            {runeword.itemTypes.join(", ")} ({runeword.sockets})
                        </div>
                    </Button>
                ))}
            </div>
        </>
    );
}
