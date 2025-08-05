import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useItems } from "@/hooks/queries";
import { APP_TITLE } from "@/lib/constants";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { TopLevelCategory, WithKey } from "@/routes/items/-types";
import { getSearchableText, ITEM_CATEGORIES } from "@/routes/items/-utils";
import BaseItemCategory from "@/routes/items/bases/-BaseItemCategory";
import { useItemDialogStore } from "@/stores/useItemDialogStore";
import { useDebouncedSearchString, useSearchFilters } from "@/stores/useSearchStore";
import type { BaseCategory, BaseItem, Tier } from "@/types/items";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlertIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

export const Route = createFileRoute("/items/bases/")({
    component: BaseItemsPage,
    head: () => ({
        meta: [
            {
                title: `Base Items - ${APP_TITLE}`,
            },
        ],
    }),
});

function BaseItemsPage() {
    const { data, isFetching, error } = useItems(["baseItems"]);
    const baseItems = data?.baseItems;

    const { item: selectedItem, type: selectedItemType, setItem } = useItemDialogStore();
    const { debouncedSearchString, clearSearch } = useDebouncedSearchString();
    const { selectedFilters, setPageFilters, clearFilters } = useSearchFilters();

    useEffect(() => {
        const filters = [
            {
                id: "item_type",
                label: "Item Type",
                options: [
                    { id: "Weapons", label: "Weapons", value: false },
                    { id: "Armor", label: "Armor", value: false },
                ],
            },
            {
                id: "item_tier",
                label: "Item Tier",
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

    const displayedItems: Record<string, BaseItem> | undefined = useMemo(() => {
        if (!baseItems) {
            return baseItems;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);

        const filtered: Record<string, BaseItem> = {};

        const filterType = (type: "Weapons" | "Armor") => {
            if (selectedFilters.Weapons || selectedFilters.Armor) {
                return selectedFilters[type];
            }
            return true;
        };

        const filterTier = (tier: Tier) => {
            if (selectedFilters.Normal || selectedFilters.Exceptional || selectedFilters.Elite) {
                return selectedFilters[tier];
            }
            return true;
        };

        Object.entries(baseItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                const itemType = Object.entries(ITEM_CATEGORIES).find(([, subcategories]) =>
                    subcategories.some(subcategory => item.category === subcategory)
                )?.[0];

                if (filterType(itemType as "Weapons" | "Armor") && filterTier(item.tier)) {
                    filtered[key] = item;
                }
            }
        });

        return filtered;
    }, [baseItems, debouncedSearchString, selectedFilters]);

    if (error) {
        return (
            <div className="max-w-2xl mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlertIcon />
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
                {Object.entries(ITEM_CATEGORIES).map(([category, subcategories]) => (
                    <BaseItemCategory
                        key={category}
                        data={displayedItems}
                        category={category as TopLevelCategory}
                        label={category}
                        subcategories={subcategories as BaseCategory[]}
                        selectedItem={
                            selectedItemType === "base-item"
                                ? (selectedItem as WithKey<BaseItem>)
                                : undefined
                        }
                        onClick={item => setItem("base-item", item)}
                    />
                ))}
            </div>
        </>
    ) : (
        <div className="mt-4 flex flex-col gap-2">
            <div className="text-center text-muted-foreground italic">No base items found.</div>
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
