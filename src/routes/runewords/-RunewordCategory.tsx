import { useMemo } from "react";
import type { Runeword, RunewordBaseType, Runewords } from "@/types/items";
import HeadingSeparator from "@/components/HeadingSeparator";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import ItemTooltipHoverCard from "@/components/ItemTooltip/ItemTooltipHoverCard";
import ItemAffix from "@/components/ItemTooltip/ItemAffix";
import { cn } from "@/lib/utils";

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
    selectedRuneword?: string | null;
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
            <HeadingSeparator>{label}</HeadingSeparator>
            <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {displayedRunewords.map(runeword => (
                    <HoverCard key={runeword.key} open={selectedRuneword === runeword.key}>
                        <HoverCardTrigger asChild>
                            <Button
                                variant="ghost"
                                color="primary"
                                size="sm"
                                className={cn(
                                    "runeword-trigger justify-start border border-transparent",
                                    runeword.key === selectedRuneword ? "border-primary" : ""
                                )}
                                onClick={() => handleRunewordClick(runeword)}
                            >
                                <div className="text-nowrap truncate">{runeword.name}</div>
                                <div className="pl-0 sm:pl-1 text-foreground/60 truncate">
                                    {runeword.itemTypes.join(", ")} ({runeword.sockets})
                                </div>
                            </Button>
                        </HoverCardTrigger>
                        <ItemTooltipHoverCard collisionPadding={4}>
                            <div className="text-primary">{runeword.name}</div>
                            <div className="text-muted-foreground">
                                {runeword.itemTypes.join(", ")}
                            </div>
                            <div className="text-primary">
                                &apos;{runeword.runes.join("")}&apos;
                            </div>
                            {runeword.implicits?.map((implicit, i) => (
                                <ItemAffix
                                    key={i}
                                    affix={implicit}
                                    color="text-white"
                                    variableColor="text-diablo-blue"
                                />
                            )) || null}
                            {runeword.affixes.map((affix, i) => (
                                <ItemAffix
                                    key={i}
                                    affix={affix}
                                    color="text-diablo-blue"
                                    variableColor="text-destructive"
                                />
                            )) || null}
                        </ItemTooltipHoverCard>
                    </HoverCard>
                ))}
            </div>
        </>
    );
}
