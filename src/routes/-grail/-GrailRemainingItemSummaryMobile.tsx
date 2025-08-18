import type { GrailProgressItem } from "@/lib/api";
import type { BaseItem, SetItem, UniqueItem } from "@/types/items";
import { useDeferredValue, useMemo, useState } from "react";
import {
    getRemainingSetBases,
    getRemainingUniqueBases,
    type SetBase,
    type UniqueBase,
} from "./-utils";
import HeadingSeparator from "@/components/HeadingSeparator";
import { Button } from "@/components/ui/button";
import UniqueBaseItem from "./-UniqueBaseItem";
import SetBaseItem from "./-SetBaseItem";
import GrailUniqueBaseDialog from "./-GrailUniqueBaseDialog";
import GrailSetBaseDialog from "./-GrailSetBaseDialog";
import { useItemDialogStore } from "@/stores/useItemDialogStore";
import { useSearchFilters } from "@/stores/useSearchStore";
import Heading from "@/components/Heading";

type Props = {
    uniqueItems: Record<string, UniqueItem>;
    setItems: Record<string, SetItem>;
    baseItems: Record<string, BaseItem>;
    grailProgress?: Record<string, GrailProgressItem>;
};

// Must be divisible by 2 and 3 for our 3-column layout to be responsive
const DEFAULT_ITEM_LIMIT = 12;

type SelectedItemState =
    | { type: "UniqueBase"; item: UniqueBase }
    | { type: "SetBase"; item: SetBase };

export default function GrailRemainingItemSummaryMobile({
    uniqueItems,
    setItems,
    baseItems,
    grailProgress,
}: Props) {
    const [itemLimitUnique, setItemLimitUnique] = useState(DEFAULT_ITEM_LIMIT);
    const [itemLimitSet, setItemLimitSet] = useState(DEFAULT_ITEM_LIMIT);
    const { setItem } = useItemDialogStore();
    const { selectedFilters } = useSearchFilters();
    const deferredSelectedFilters = useDeferredValue(selectedFilters);
    const itemFilters = Object.fromEntries(
        Object.entries(deferredSelectedFilters).filter(([key]) => key !== "Hide Found Items")
    );

    const remainingUniqueBases = useMemo(
        () =>
            grailProgress
                ? getRemainingUniqueBases(uniqueItems, baseItems, grailProgress, itemFilters)
                : {},
        [uniqueItems, baseItems, grailProgress, itemFilters]
    );
    const remainingSetBases = useMemo(
        () =>
            grailProgress
                ? getRemainingSetBases(setItems, baseItems, grailProgress, itemFilters)
                : {},
        [setItems, baseItems, grailProgress, itemFilters]
    );

    const displayedUniqueBases = Object.entries(remainingUniqueBases)
        .map(([key, item]) => {
            return {
                key,
                ...item,
            };
        })
        .filter(entry => entry.notFoundUniqueItems.length && !entry.hide)
        .sort((a, b) => a.key.localeCompare(b.key));
    const displayedSetBases = Object.entries(remainingSetBases)
        .map(([key, item]) => {
            return {
                key,
                ...item,
            };
        })
        .filter(entry => entry.notFoundSetItems.length && !entry.hide)
        .sort((a, b) => a.key.localeCompare(b.key));

    const [selectedItemBase, setSelectedItemBase] = useState<SelectedItemState>();

    const hasItemOverflowUnique = displayedUniqueBases.length > DEFAULT_ITEM_LIMIT;
    const hasItemOverflowSet = displayedSetBases.length > DEFAULT_ITEM_LIMIT;

    const showUniqueBases = !!displayedUniqueBases.length;
    const showSetBases = !!displayedSetBases.length;

    if (displayedSetBases.length === 0 && displayedUniqueBases.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            <Heading className="text-destructive">Remaining Grail Items</Heading>
            <div className="text-muted-foreground text-sm text-center">
                If you see any of these unidentified items, pick them up. They may be grail items
                you&apos;re missing.
            </div>
            <div className="grid gap-4">
                {showUniqueBases ? (
                    <div className="grid gap-4 content-start">
                        <HeadingSeparator className="text-primary">Unique Bases</HeadingSeparator>
                        <div className="grid gap-1 grid-cols-2 sm:grid-cols-3">
                            {displayedUniqueBases
                                .slice(0, itemLimitUnique)
                                .map(({ key, ...rest }) => (
                                    <UniqueBaseItem
                                        key={key}
                                        uniqueBase={rest}
                                        selectedUniqueBase={
                                            selectedItemBase?.type === "UniqueBase"
                                                ? selectedItemBase.item
                                                : null
                                        }
                                        onClick={item =>
                                            setSelectedItemBase({ type: "UniqueBase", item })
                                        }
                                    />
                                ))}
                        </div>
                    </div>
                ) : null}
                {hasItemOverflowUnique ? (
                    <div className="flex justify-center">
                        {itemLimitUnique === Infinity ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="italic text-muted-foreground"
                                onClick={() => setItemLimitUnique(DEFAULT_ITEM_LIMIT)}
                            >
                                show less
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="italic text-muted-foreground"
                                onClick={() => setItemLimitUnique(Infinity)}
                            >
                                show more
                            </Button>
                        )}
                    </div>
                ) : null}
                {showSetBases ? (
                    <div className="grid gap-4 content-start">
                        <HeadingSeparator className="text-diablo-green">Set Bases</HeadingSeparator>
                        <div className="grid gap-1 grid-cols-2 sm:grid-cols-3">
                            {displayedSetBases.slice(0, itemLimitSet).map(({ key, ...rest }) => (
                                <SetBaseItem
                                    key={key}
                                    setBase={rest}
                                    selectedSetBase={
                                        selectedItemBase?.type === "SetBase"
                                            ? selectedItemBase.item
                                            : null
                                    }
                                    onClick={item => setSelectedItemBase({ type: "SetBase", item })}
                                />
                            ))}
                        </div>
                    </div>
                ) : null}
                {hasItemOverflowSet ? (
                    <div className="flex justify-center">
                        {itemLimitSet === Infinity ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="italic text-muted-foreground"
                                onClick={() => setItemLimitSet(DEFAULT_ITEM_LIMIT)}
                            >
                                show less
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="italic text-muted-foreground"
                                onClick={() => setItemLimitSet(Infinity)}
                            >
                                show more
                            </Button>
                        )}
                    </div>
                ) : null}
            </div>
            <GrailUniqueBaseDialog
                open={selectedItemBase?.type === "UniqueBase"}
                onOpenChange={open => !open && setSelectedItemBase(undefined)}
                base={
                    selectedItemBase?.type === "UniqueBase" ? selectedItemBase.item.base : undefined
                }
                foundUniqueItems={
                    selectedItemBase?.type === "UniqueBase"
                        ? selectedItemBase.item.foundUniqueItems
                        : undefined
                }
                notFoundUniqueItems={
                    selectedItemBase?.type === "UniqueBase"
                        ? selectedItemBase.item.notFoundUniqueItems
                        : undefined
                }
                onClick={item => {
                    setItem("unique-item", item);
                    setSelectedItemBase(undefined);
                }}
            />
            <GrailSetBaseDialog
                open={selectedItemBase?.type === "SetBase"}
                onOpenChange={open => !open && setSelectedItemBase(undefined)}
                base={selectedItemBase?.type === "SetBase" ? selectedItemBase.item.base : undefined}
                foundSetItems={
                    selectedItemBase?.type === "SetBase"
                        ? selectedItemBase.item.foundSetItems
                        : undefined
                }
                notFoundSetItems={
                    selectedItemBase?.type === "SetBase"
                        ? selectedItemBase.item.notFoundSetItems
                        : undefined
                }
                onClick={item => {
                    setItem("set-item", item);
                    setSelectedItemBase(undefined);
                }}
            />
        </div>
    );
}
