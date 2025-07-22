import HeadingSeparator from "@/components/HeadingSeparator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useItems } from "@/hooks/queries";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { RuneArrayItem } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import { useItemDialogStore } from "@/stores/useItemDialogStore";
import { useDebouncedSearch, useSearchFilters } from "@/stores/useSearchStore";
import type { Rune } from "@/types/items";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { CircleAlert } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/items/runes/")({
    component: RunesPage,
});

function RunesPage() {
    const { data, isFetching, error } = useItems(["runes"]);
    const runes = data?.runes;

    const { item: selectedItem, type: selectedItemType, setItem } = useItemDialogStore();
    const { debouncedSearchString, clearSearch } = useDebouncedSearch();
    const { clearFilters } = useSearchFilters();

    const displayedRunes: RuneArrayItem[] = useMemo(() => {
        if (!runes || !debouncedSearchString.trim()) {
            return Object.entries(runes || {}).map(([key, value]) => ({
                ...value,
                key,
            }));
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        if (searchTerms.length === 0) {
            return Object.entries(runes || {}).map(([key, value]) => ({
                ...value,
                key,
            }));
        }

        const filtered: Record<string, Rune> = {};

        Object.entries(runes).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered[key] = item;
            }
        });

        return Object.entries(filtered).map(([key, value]) => ({
            ...value,
            key,
        }));
    }, [runes, debouncedSearchString]);

    if (error) {
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

    if (isFetching || !displayedRunes) {
        return (
            <div className="grid grid-cols-1 gap-4 opacity-20">
                <div>
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
            </div>
        );
    }

    return Object.keys(displayedRunes).length ? (
        <>
            <div className="grid gap-4">
                <HeadingSeparator className="text-diablo-orange">Runes</HeadingSeparator>
                <div className="grid gap-1 grid-cols-3 md:grid-cols-6 justify-items-center">
                    {displayedRunes.map(rune => (
                        <div className="flex w-28 justify-start" key={rune.key}>
                            <Button
                                key={rune.key}
                                variant="ghost"
                                size="sm"
                                className={clsx(
                                    "item-trigger justify-start border border-transparent inline-flex w-fit max-w-full",
                                    selectedItemType === "rune" && rune.key === selectedItem?.key
                                        ? "border-primary"
                                        : ""
                                )}
                                onClick={() => setItem("rune", rune)}
                                aria-haspopup="dialog"
                                aria-label={`View details for ${rune.name}`}
                            >
                                <img
                                    src={`/img/${rune.key.toLowerCase()}.webp`}
                                    className="h-[2em]"
                                />
                                <div className="text-nowrap truncate">{rune.name}</div>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    ) : (
        <div className="mt-4 flex flex-col gap-2">
            <div className="text-center text-muted-foreground italic">No runes found.</div>
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
