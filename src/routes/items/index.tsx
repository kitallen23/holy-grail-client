import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useItems } from "@/hooks/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import UniqueItemCategory from "@/routes/items/-UniqueItemCategory";
import { getSearchableText } from "@/routes/items/-utils";
import type { BaseCategory } from "@/types/items";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

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

    const [searchString, setSearchString] = useState("");
    const debouncedSearchString = useDebounce(searchString, SEARCH_DEBOUNCE_DELAY);

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
        id: string;
    } | null>(null);

    // useEffect(() => {
    //     const handleGlobalClick = (event: MouseEvent) => {
    //         const target = event.target as Element;
    //         const isRunewordTrigger = target.closest("button.item-trigger");

    //         if (!isRunewordTrigger) {
    //             setSelectedItem(null);
    //         }
    //     };
    //     const handleKeyDown = (event: KeyboardEvent) => {
    //         if (event.key === "Escape") {
    //             setSelectedItem(null);
    //         }
    //     };

    //     document.addEventListener("click", handleGlobalClick);
    //     document.addEventListener("keydown", handleKeyDown);

    //     return () => {
    //         document.removeEventListener("click", handleGlobalClick);
    //         document.removeEventListener("keydown", handleKeyDown);
    //     };
    // }, []);

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
        return null;
    }

    return (
        <div className="pt-4 pb-8 grid grid-cols-1 gap-4">
            <div className="max-w-96 m-auto w-full grid grid-cols-[1fr_auto] gap-2">
                <div className="relative">
                    <Input
                        value={searchString}
                        onChange={event => setSearchString(event.target.value)}
                        placeholder="Search..."
                        type="search"
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
                        selectedItem={selectedItem?.id}
                        onClick={item =>
                            setSelectedItem(item?.key ? { type: "uniqueItem", id: item.key } : null)
                        }
                    />
                ))}
            </div>
        </div>
    );
}
