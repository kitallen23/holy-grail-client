import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { BaseCategory, Rune, SetItem, UniqueItem } from "@/types/items";
import { SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import { useItems } from "@/hooks/queries";
import { useDebounce } from "@/hooks/useDebounce";
import type { WithKey } from "@/routes/items/-types";
import UniqueItemCategory from "@/routes/items/-UniqueItemCategory";
import { getSearchableText } from "@/routes/items/-utils";

import UniqueItemDialog from "@/components/ItemTooltip/UniqueItemDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/items/")({
    component: ItemsPage,
});

type TopLevelCategory = "Armor" | "Weapons" | "Other";
const UNIQUE_CATEGORIES = {
    Weapons: [
        "Axes",
        "Bows",
        "Crossbows",
        "Daggers",
        "Javelins",
        "Hammers",
        "Maces",
        "Polearms",
        "Scepters",
        "Spears",
        "Staves",
        "Swords",
        "Throwing Weapons",
        "Wands",
        "Amazon Bows",
        "Amazon Javelins",
        "Amazon Spears",
        "Assassin Katars",
        "Sorceress Orbs",
    ],
    Armor: [
        "Belts",
        "Armor",
        "Boots",
        "Circlets",
        "Gloves",
        "Helmets",
        "Shields",
        "Barbarian Helmets",
        "Druid Pelts",
        "Necromancer Shrunken Heads",
        "Paladin Shields",
    ],
    Other: ["Amulets", "Rings", "Jewels", "Charms"],
};

function ItemsPage() {
    const { data, isFetching, error } = useItems();

    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchString, setSearchString] = useState("");
    const debouncedSearchString = useDebounce(searchString, SEARCH_DEBOUNCE_DELAY);

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

    const displayedItems = useMemo(() => {
        if (!data || !debouncedSearchString.trim()) {
            return data;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        if (searchTerms.length === 0) {
            return data;
        }

        const filtered: typeof data = {
            uniqueItems: {},
            setItems: {},
            runes: {},
        };

        Object.entries(data.uniqueItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered.uniqueItems[key] = item;
            }
        });
        Object.entries(data.setItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered.setItems[key] = item;
            }
        });
        Object.entries(data.runes).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered.runes[key] = item;
            }
        });

        return filtered;
    }, [data, debouncedSearchString]);

    const [selectedItem, setSelectedItem] = useState<{
        type: "uniqueItem" | "setItem" | "rune";
        item: WithKey<UniqueItem> | WithKey<SetItem> | WithKey<Rune>;
    } | null>(null);

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

    if (isFetching || !displayedItems) {
        return (
            <div className="pt-4 grid grid-cols-1 gap-4 opacity-20">
                <div className="max-w-96 m-auto w-full grid grid-cols-[1fr_auto] gap-2">
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9 w-9" />
                </div>
                <div>
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
            </div>
        );
    }

    return (
        <>
            <div className="pt-4 pb-8 grid grid-cols-1 gap-4">
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
                                onClick={() => {
                                    setSearchString("");
                                }}
                            >
                                <XIcon />
                                <span className="sr-only">Clear</span>
                            </Button>
                        )}
                    </div>
                </div>
                <div className="grid gap-4">
                    {Object.entries(UNIQUE_CATEGORIES).map(([category, subcategories]) => (
                        <UniqueItemCategory
                            key={category}
                            data={displayedItems.uniqueItems}
                            category={category as TopLevelCategory}
                            label={category}
                            subcategories={subcategories as BaseCategory[]}
                            selectedItem={selectedItem?.item}
                            onClick={item =>
                                setSelectedItem(item ? { type: "uniqueItem", item } : null)
                            }
                        />
                    ))}
                </div>
            </div>
            <UniqueItemDialog
                open={!!(selectedItem && selectedItem.type === "uniqueItem" && selectedItem.item)}
                onOpenChange={open => !open && setSelectedItem(null)}
                item={selectedItem?.item as UniqueItem}
            />
        </>
    );
}
