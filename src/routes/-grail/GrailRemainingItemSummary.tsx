import type { GrailProgressItem } from "@/lib/api";
import type { BaseItem, SetItem, UniqueItem } from "@/types/items";
import { useEffect, useMemo, useState } from "react";
import {
    getRemainingSetBases,
    getRemainingUniqueBases,
    type SetBase,
    type UniqueBase,
} from "./utils";
import HeadingSeparator from "@/components/HeadingSeparator";
import { Button } from "@/components/ui/button";
import UniqueBaseItem from "./UniqueBaseItem";
import SetBaseItem from "./SetBaseItem";
import GrailUniqueBaseDialog from "./GrailUniqueBaseDialog";
import type { WithKey } from "@/routes/items/-types";

type Props = {
    uniqueItems: Record<string, UniqueItem>;
    setItems: Record<string, SetItem>;
    baseItems: Record<string, BaseItem>;
    grailProgress: Record<string, GrailProgressItem>;
};

// Must be divisible by 2 and 3 for our 3-column layout to be responsive
const DEFAULT_ITEM_LIMIT = 24;

type SelectedItemState =
    | { type: "UniqueBase"; item: UniqueBase }
    | { type: "SetBase"; item: SetBase }
    | { type: "UniqueItem"; item: WithKey<UniqueItem> }
    | { type: "SetItem"; item: WithKey<SetItem> }
    | { type: "BaseItem"; item: WithKey<BaseItem> }
    | null;

export default function GrailRemainingItemSummary({
    uniqueItems,
    setItems,
    baseItems,
    grailProgress,
}: Props) {
    const [itemLimit, setItemLimit] = useState(DEFAULT_ITEM_LIMIT);

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
        .filter(entry => entry.notFoundUniqueItems.length)
        .sort((a, b) => (a.key > b.key ? 1 : 0));
    const displayedSetBases = Object.entries(remainingSetBases)
        .map(([key, item]) => {
            return {
                key,
                ...item,
            };
        })
        .filter(entry => entry.notFoundSetItems.length)
        .sort((a, b) => (a.key > b.key ? 1 : 0));

    const [selectedItem, setSelectedItem] = useState<SelectedItemState>(null);
    useEffect(() => {
        // TODO: Remove me
        console.info(`selectedItem: `, selectedItem);
    }, [selectedItem]);

    const hasItemOverflow =
        displayedUniqueBases.length > DEFAULT_ITEM_LIMIT ||
        displayedSetBases.length > DEFAULT_ITEM_LIMIT;

    return (
        <>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-4 content-start">
                    <HeadingSeparator className="text-primary">Unique Bases</HeadingSeparator>
                    <div className="grid gap-1 grid-cols-2 sm:grid-cols-3">
                        {displayedUniqueBases
                            .slice(0, itemLimit)
                            .map(({ key, base, notFoundUniqueItems, foundUniqueItems }) => (
                                <UniqueBaseItem
                                    key={key}
                                    uniqueBase={{ base, notFoundUniqueItems, foundUniqueItems }}
                                    selectedUniqueBase={
                                        selectedItem?.type === "UniqueBase"
                                            ? selectedItem.item
                                            : null
                                    }
                                    onClick={item => setSelectedItem({ type: "UniqueBase", item })}
                                />
                            ))}
                    </div>
                </div>
                <div className="grid gap-4 content-start">
                    <HeadingSeparator className="text-diablo-green">Set Bases</HeadingSeparator>
                    <div className="grid gap-1 grid-cols-2 sm:grid-cols-3">
                        {displayedSetBases
                            .slice(0, itemLimit)
                            .map(({ key, base, notFoundSetItems, foundSetItems }) => (
                                <SetBaseItem
                                    key={key}
                                    setBase={{ base, notFoundSetItems, foundSetItems }}
                                    selectedSetBase={
                                        selectedItem?.type === "SetBase" ? selectedItem.item : null
                                    }
                                    onClick={item => setSelectedItem({ type: "SetBase", item })}
                                />
                            ))}
                    </div>
                </div>
            </div>
            {hasItemOverflow ? (
                <div className="flex justify-center">
                    {itemLimit === Infinity ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="italic text-muted-foreground"
                            onClick={() => setItemLimit(DEFAULT_ITEM_LIMIT)}
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
                </div>
            ) : null}
            <GrailUniqueBaseDialog
                open={selectedItem?.type === "UniqueBase"}
                onOpenChange={open => !open && setSelectedItem(null)}
                base={selectedItem?.type === "UniqueBase" ? selectedItem.item.base : undefined}
                foundUniqueItems={
                    selectedItem?.type === "UniqueBase"
                        ? selectedItem.item.foundUniqueItems
                        : undefined
                }
                notFoundUniqueItems={
                    selectedItem?.type === "UniqueBase"
                        ? selectedItem.item.notFoundUniqueItems
                        : undefined
                }
            />
        </>
    );
}
