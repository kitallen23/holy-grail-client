import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert, Filter, X } from "lucide-react";

import { useRunewords } from "@/hooks/queries";
import RunewordCategory from "@/routes/runewords/-RunewordCategory";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import { getSearchableText } from "@/routes/runewords/-utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Runeword, RunewordBaseType } from "@/types/items";
import { Skeleton } from "@/components/ui/skeleton";
import type { WithKey } from "@/routes/items/-types";
import RunewordDialog from "@/components/ItemTooltip/RunewordDialog";
import { useDebouncedSearch } from "@/stores/useSearchStore";

export const Route = createFileRoute("/runewords/")({
    component: RunewordsPage,
});

function RunewordsPage() {
    const { data, isFetching, error } = useRunewords();

    const searchInputRef = useRef<HTMLInputElement>(null);
    const { searchString, debouncedSearchString, setSearchString, clearSearch } =
        useDebouncedSearch();

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

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        } else if (e.key === "Escape") {
            e.currentTarget.blur();
            setSearchString("");
        }
    };

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

    const [itemTypeFilter, setItemTypeFilter] = useState<Record<RunewordBaseType, boolean>>({
        Weapons: false,
        "Body Armor": false,
        Shields: false,
        Helmets: false,
    });

    const [selectedRuneword, setSelectedRuneword] = useState<WithKey<Runeword> | null>(null);

    if (error) {
        return (
            <div className="max-w-2xl mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlert />
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
                <div className="max-w-96 m-auto w-full grid grid-cols-[1fr_auto] gap-2">
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9 w-9" />
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

    const disableFilter = !Object.values(itemTypeFilter).some(val => val);

    return (
        <>
            <div className="pt-4 grid grid-cols-1 gap-4">
                <div className="max-w-96 m-auto w-full grid grid-cols-[1fr_auto] gap-2">
                    <div className="relative">
                        <Input
                            ref={searchInputRef}
                            value={searchString}
                            onChange={event => setSearchString(event.target.value)}
                            placeholder="Search..."
                            type="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            enterKeyHint="done"
                            onKeyDown={handleInputKeyDown}
                        />
                        {searchString && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-current/60 hover:text-current"
                                onClick={clearSearch}
                            >
                                <X />
                                <span className="sr-only">Clear</span>
                            </Button>
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={disableFilter ? "outline" : "default"} size="icon">
                                <Filter />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            {Object.entries(itemTypeFilter).map(([key, checked]) => (
                                <DropdownMenuCheckboxItem
                                    key={key}
                                    checked={checked === true}
                                    onCheckedChange={() =>
                                        setItemTypeFilter(prev => ({
                                            ...prev,
                                            [key]: !checked,
                                        }))
                                    }
                                    onSelect={event => event.preventDefault()}
                                >
                                    {key}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="grid gap-4">
                    {disableFilter || itemTypeFilter["Weapons"] ? (
                        <RunewordCategory
                            data={displayedRunewords}
                            category="Weapons"
                            label="Weapons"
                            selectedRuneword={selectedRuneword}
                            onClick={runeword => setSelectedRuneword(runeword || null)}
                        />
                    ) : null}
                    {disableFilter || itemTypeFilter["Body Armor"] ? (
                        <RunewordCategory
                            data={displayedRunewords}
                            category="Body Armor"
                            label="Body Armor"
                            selectedRuneword={selectedRuneword}
                            onClick={runeword => setSelectedRuneword(runeword || null)}
                        />
                    ) : null}
                    {disableFilter || itemTypeFilter["Shields"] ? (
                        <RunewordCategory
                            data={displayedRunewords}
                            category="Shields"
                            label="Shields"
                            selectedRuneword={selectedRuneword}
                            onClick={runeword => setSelectedRuneword(runeword || null)}
                        />
                    ) : null}
                    {disableFilter || itemTypeFilter["Helmets"] ? (
                        <RunewordCategory
                            data={displayedRunewords}
                            category="Helmets"
                            label="Helmets"
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
