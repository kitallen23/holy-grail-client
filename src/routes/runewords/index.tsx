import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlertIcon } from "lucide-react";

import { useRunewords } from "@/hooks/queries";
import RunewordCategory from "@/routes/runewords/-RunewordCategory";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import { getSearchableText } from "@/routes/runewords/-utils";
import type { Runeword } from "@/types/items";
import { Skeleton } from "@/components/ui/skeleton";
import type { WithKey } from "@/routes/items/-types";
import RunewordDialog from "@/components/ItemTooltip/RunewordDialog";
import { useDebouncedSearch, useSearchFilters } from "@/stores/useSearchStore";

export const Route = createFileRoute("/runewords/")({
    component: RunewordsPage,
});

function RunewordsPage() {
    const { selectedFilters, setPageFilters } = useSearchFilters();
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

    const searchInputRef = useRef<HTMLInputElement>(null);
    const { debouncedSearchString } = useDebouncedSearch();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
                return;
            }

            // Forward slash (only if not typing in an input)
            if (
                e.key === "/" &&
                !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
            ) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Filter runewords based on search
    const displayedRunewords = useMemo(() => {
        if (!data || !debouncedSearchString.trim()) {
            return data;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        if (searchTerms.length === 0) {
            return data;
        }

        const filtered: typeof data = {};

        Object.entries(data).forEach(([key, runeword]) => {
            const searchableText = getSearchableText(runeword);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered[key] = runeword;
            }
        });

        return filtered;
    }, [data, debouncedSearchString]);

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

    const disableFilter = !Object.values(selectedFilters).some(val => val);

    return (
        <>
            <div className="pt-4 grid grid-cols-1 gap-4">
                <div className="grid gap-4">
                    {disableFilter || selectedFilters["Weapons"] ? (
                        <RunewordCategory
                            data={displayedRunewords}
                            category="Weapons"
                            label="Weapons"
                            selectedRuneword={selectedRuneword}
                            onClick={runeword => setSelectedRuneword(runeword || null)}
                        />
                    ) : null}
                    {disableFilter || selectedFilters["Body Armor"] ? (
                        <RunewordCategory
                            data={displayedRunewords}
                            category="Body Armor"
                            label="Body Armor"
                            selectedRuneword={selectedRuneword}
                            onClick={runeword => setSelectedRuneword(runeword || null)}
                        />
                    ) : null}
                    {disableFilter || selectedFilters["Helmets"] ? (
                        <RunewordCategory
                            data={displayedRunewords}
                            category="Helmets"
                            label="Helmets"
                            selectedRuneword={selectedRuneword}
                            onClick={runeword => setSelectedRuneword(runeword || null)}
                        />
                    ) : null}
                    {disableFilter || selectedFilters["Shields"] ? (
                        <RunewordCategory
                            data={displayedRunewords}
                            category="Shields"
                            label="Shields"
                            selectedRuneword={selectedRuneword}
                            onClick={runeword => setSelectedRuneword(runeword || null)}
                        />
                    ) : null}
                </div>
            </div>
            <RunewordDialog
                open={!!selectedRuneword}
                onOpenChange={open => !open && setSelectedRuneword(null)}
                runeword={selectedRuneword as Runeword}
            />
        </>
    );
}
