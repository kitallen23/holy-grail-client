import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlertIcon } from "lucide-react";

import { useRunewords } from "@/hooks/queries";
import RunewordCategory from "@/routes/runewords/-RunewordCategory";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import { getSearchableText } from "@/routes/runewords/-utils";
import type { Runeword, RunewordBaseType } from "@/types/items";
import { Skeleton } from "@/components/ui/skeleton";
import type { WithKey } from "@/routes/items/-types";
import RunewordDialog from "@/components/ItemTooltip/RunewordDialog";
import { useDebouncedSearch, useSearchFilters } from "@/stores/useSearchStore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/runewords/")({
    component: RunewordsPage,
});

const RUNEWORD_BASE_TYPES: RunewordBaseType[] = ["Weapons", "Body Armor", "Helmets", "Shields"];

function RunewordsPage() {
    const { selectedFilters, setPageFilters, clearFilters } = useSearchFilters();
    const { debouncedSearchString, clearSearch } = useDebouncedSearch();
    const { data, isFetching, error } = useRunewords();

    useEffect(() => {
        const filters = [
            {
                id: "base_type",
                label: "Base Type",
                options: [
                    { id: "Weapons", label: "Weapons", value: false },
                    { id: "Body Armor", label: "Body Armor", value: false },
                    { id: "Helmets", label: "Helmets", value: false },
                    { id: "Shields", label: "Shields", value: false },
                ],
            },
        ];
        setPageFilters(filters);

        return () => setPageFilters(null);
    }, []);

    // Filter runewords based on search
    const displayedRunewords = useMemo(() => {
        if (!data) {
            return data;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);

        const filtered: typeof data = {};
        const disableFilter = !Object.values(selectedFilters).some(val => val);

        Object.entries(data).forEach(([key, runeword]) => {
            const searchableText = getSearchableText(runeword);
            if (matchesAllTerms(searchableText, searchTerms)) {
                if (disableFilter || selectedFilters[runeword.type]) {
                    filtered[key] = runeword;
                }
            }
        });

        return filtered;
    }, [data, debouncedSearchString, selectedFilters]);

    const [selectedRuneword, setSelectedRuneword] = useState<WithKey<Runeword> | null>(null);

    if (error) {
        return (
            <div className="max-w-2xl mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Something went wrong when loading runewords. Please refresh the page or try
                        again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isFetching || !displayedRunewords) {
        return (
            <div className="pt-4 grid grid-cols-1 gap-4 opacity-20">
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

    return Object.keys(displayedRunewords).length ? (
        <>
            <div className="pt-4 grid grid-cols-1 gap-4 pb-8">
                <div className="grid gap-4">
                    {RUNEWORD_BASE_TYPES.map(runewordBaseType => (
                        <RunewordCategory
                            key={runewordBaseType}
                            data={displayedRunewords}
                            category={runewordBaseType}
                            label={runewordBaseType}
                            selectedRuneword={selectedRuneword}
                            onClick={runeword => setSelectedRuneword(runeword || null)}
                        />
                    ))}
                </div>
            </div>
            <RunewordDialog
                open={!!selectedRuneword}
                onOpenChange={open => !open && setSelectedRuneword(null)}
                runeword={selectedRuneword as Runeword}
            />
        </>
    ) : (
        <div className="mt-4 flex flex-col gap-2">
            <div className="text-center text-muted-foreground italic">No runewords found.</div>
            <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground self-center"
                onClick={() => {
                    clearSearch();
                    clearFilters();
                }}
            >
                Clear filters
            </Button>
        </div>
    );
}
