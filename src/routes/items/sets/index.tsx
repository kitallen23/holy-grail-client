import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useItems } from "@/hooks/queries";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { WithKey } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import type { BaseItem, SetItem, Tier } from "@/types/items";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SetItemDialog from "@/components/ItemTooltip/SetItemDialog";
import SetTier from "@/routes/items/sets/-SetTier";
import { useDebouncedSearch, useSearchFilters } from "@/stores/useSearchStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SETS } from "@/routes/items/sets/-utils";
import { DialogContent } from "@/components/ui/dialog";
import BaseItemDialog from "@/components/ItemTooltip/BaseItemDialog";

export const Route = createFileRoute("/items/sets/")({
    component: SetItemsPage,
});

const TIERS: Tier[] = ["Normal", "Exceptional", "Elite"];

function SetItemsPage() {
    const { data, isFetching, error } = useItems("sets");
    const { data: basesData, isFetching: isFetchingBases, error: basesError } = useItems("bases");
    const { debouncedSearchString, clearSearch } = useDebouncedSearch();
    const { selectedFilters, setPageFilters, clearFilters } = useSearchFilters();

    useEffect(() => {
        const filters = [
            {
                id: "set_tier",
                label: "Set Tier",
                options: [
                    { id: "Normal", label: "Normal", value: false },
                    { id: "Exceptional", label: "Exceptional", value: false },
                    { id: "Elite", label: "Elite", value: false },
                ],
            },
        ];
        setPageFilters(filters);

        return () => setPageFilters(null);
    }, []);

    const displayedItems: Record<string, SetItem> | undefined = useMemo(() => {
        if (!data) {
            return data;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);

        const filtered: Record<string, SetItem> = {};
        const disableFilter = !Object.values(selectedFilters).some(val => val);

        Object.entries(data).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                const setTier = SETS.find(set => set.name === item.category)?.tier;
                if (disableFilter || selectedFilters[setTier!]) {
                    filtered[key] = item;
                }
            }
        });

        return filtered;
    }, [data, debouncedSearchString, selectedFilters]);

    const [selectedItem, setSelectedItem] = useState<WithKey<SetItem> | null>(null);
    const [selectedBaseItem, setSelectedBaseItem] = useState<WithKey<BaseItem> | null>(null);
    const dialogRef = useRef<React.ComponentRef<typeof DialogContent>>(null);
    const baseDialogRef = useRef<React.ComponentRef<typeof DialogContent>>(null);

    const handleSetItemClick = (itemName: string) => {
        const setItem = Object.values(data || {}).find(item => item.name === itemName);
        if (setItem) {
            setSelectedItem(setItem);
        }
        dialogRef.current?.scrollTo(0, 0);
    };
    const handleBaseItemClick = (itemName: string) => {
        const baseItem = Object.values(basesData || {}).find(item => item.name === itemName);
        if (baseItem) {
            setSelectedBaseItem(baseItem);
        }
        setSelectedItem(null);
        baseDialogRef.current?.scrollTo(0, 0);
    };

    if (error || basesError) {
        return (
            <div className="max-w-2xl mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Something went wrong when loading items. Please refresh the page or try
                        again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isFetching || isFetchingBases || !displayedItems) {
        return (
            <div className="grid grid-cols-1 gap-4 opacity-20">
                <div className="pb-1 flex justify-center items-center h-9">
                    <Skeleton className="w-24 h-6" />
                </div>
                <div className="flex items-center">
                    <Skeleton className="flex-1 h-[1px]" />
                    <span className="px-4 h-7 flex items-center">
                        <Skeleton className="w-14 h-4" />
                    </span>
                    <Skeleton className="flex-1 h-[1px]" />
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-32 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-24 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-36 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-20 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-44 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-24 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-28 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return Object.keys(displayedItems).length ? (
        <>
            <div className="grid gap-4">
                {TIERS.map(tier => (
                    <SetTier
                        key={tier}
                        data={displayedItems}
                        tier={tier}
                        selectedItem={selectedItem}
                        onClick={item => setSelectedItem(item || null)}
                    />
                ))}
            </div>
            <SetItemDialog
                ref={dialogRef}
                open={!!selectedItem}
                onOpenChange={open => !open && setSelectedItem(null)}
                item={selectedItem as SetItem}
                onSetItemClick={handleSetItemClick}
                onBaseItemClick={handleBaseItemClick}
            />
            <BaseItemDialog
                ref={baseDialogRef}
                open={!!selectedBaseItem}
                onOpenChange={open => !open && setSelectedBaseItem(null)}
                item={selectedBaseItem as BaseItem}
                onBaseItemClick={handleBaseItemClick}
            />
        </>
    ) : (
        <div className="mt-4 flex flex-col gap-2">
            <div className="text-center text-muted-foreground italic">No set items found.</div>
            <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground self-center"
                onClick={() => {
                    clearSearch();
                    clearFilters();
                }}
            >
                Clear filter
            </Button>
        </div>
    );
}
