import type { GrailProgressItem } from "@/lib/api";
import type { BaseItem, SetItem, UniqueItem } from "@/types/items";
import { useMemo, useState } from "react";
import {
    getRemainingSetBases,
    getRemainingUniqueBases,
    type SetBase,
    type UniqueBase,
} from "./utils";
import HeadingSeparator from "@/components/HeadingSeparator";
import UniqueBaseItem from "./UniqueBaseItem";
import SetBaseItem from "./SetBaseItem";
import { Button } from "@/components/ui/button";

type Props = {
    uniqueItems: Record<string, UniqueItem>;
    setItems: Record<string, SetItem>;
    baseItems: Record<string, BaseItem>;
    grailProgress: Record<string, GrailProgressItem>;
};

export default function GrailRemainingItemSummary({
    uniqueItems,
    setItems,
    baseItems,
    grailProgress,
}: Props) {
    const [itemLimit, setItemLimit] = useState(24);

    const remainingUniqueBases = useMemo(
        () => getRemainingUniqueBases(uniqueItems, baseItems, grailProgress),
        [uniqueItems, baseItems, grailProgress]
    );
    const remainingSetBases = useMemo(
        () => getRemainingSetBases(setItems, baseItems, grailProgress),
        [setItems, baseItems, grailProgress]
    );

    const displayedUniqueBases = Object.entries(remainingUniqueBases)
        .map(([key, item]) => {
            return {
                key,
                ...item,
            };
        })
        .sort((a, b) => (a.key > b.key ? 1 : 0))
        .slice(0, itemLimit);
    const displayedSetBases = Object.entries(remainingSetBases)
        .map(([key, item]) => {
            return {
                key,
                ...item,
            };
        })
        .sort((a, b) => (a.key > b.key ? 1 : 0))
        .slice(0, itemLimit);

    const [selectedUniqueBase, setSelectedUniqueBase] = useState<UniqueBase | null>(null);
    const [selectedSetBase, setSelectedSetBase] = useState<SetBase | null>(null);

    return (
        <>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-4 content-start">
                    <HeadingSeparator color="text-primary">Unique Bases</HeadingSeparator>
                    <div className="grid gap-1 grid-cols-2 sm:grid-cols-3">
                        {displayedUniqueBases.map(({ key, base, uniqueItems }) => (
                            <UniqueBaseItem
                                key={key}
                                uniqueBase={{ base, uniqueItems }}
                                selectedUniqueBase={selectedUniqueBase}
                                onClick={setSelectedUniqueBase}
                            />
                        ))}
                    </div>
                </div>
                <div className="grid gap-4 content-start">
                    <HeadingSeparator color="text-diablo-green">Set Bases</HeadingSeparator>
                    <div className="grid gap-1 grid-cols-2 sm:grid-cols-3">
                        {displayedSetBases.map(({ key, base, setItems }) => (
                            <SetBaseItem
                                key={key}
                                setBase={{ base, setItems }}
                                selectedSetBase={selectedSetBase}
                                onClick={setSelectedSetBase}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {itemLimit === Infinity ? (
                <Button
                    variant="ghost"
                    size="sm"
                    className="italic text-muted-foreground"
                    onClick={() => setItemLimit(Infinity)}
                >
                    show less
                </Button>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    className="italic text-muted-foreground"
                    onClick={() => setItemLimit(Infinity)}
                >
                    show more
                </Button>
            )}
        </>
    );
}
