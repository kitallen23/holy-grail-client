import UniqueItemDialog from "@/components/ItemTooltip/UniqueItemDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { useItems } from "@/hooks/queries";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { BaseCategory, TopLevelCategory, WithKey } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import UniqueItemCategory from "@/routes/items/unique/-UniqueItemCategory";
import { UNIQUE_CATEGORIES } from "@/routes/items/unique/-utils";
import { useDebouncedSearch, useSearchFilters } from "@/stores/useSearchStore";
import type { UniqueItem } from "@/types/items";

import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/items/unique/")({
    component: UniqueItemsPage,
});

function UniqueItemsPage() {
    const { data, isFetching, error } = useItems("unique");
    const { debouncedSearchString } = useDebouncedSearch();
    const { selectedFilters, setPageFilters } = useSearchFilters();

    useEffect(() => {
        const filters = [
            {
                id: "item_type",
                label: "Item Type",
                options: [
                    { id: "Weapons", label: "Weapons", value: false },
                    { id: "Armor", label: "Armor", value: false },
                    { id: "Other", label: "Other", value: false },
                ],
            },
        ];
        setPageFilters(filters);

        return () => setPageFilters(null);
    }, []);

    const displayedItems: Record<string, UniqueItem> | undefined = useMemo(() => {
        if (!data || !debouncedSearchString.trim()) {
            return data as Record<string, UniqueItem>;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        if (searchTerms.length === 0) {
            return data as Record<string, UniqueItem>;
        }

        const filtered: Record<string, UniqueItem> = {};

        Object.entries(data).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered[key] = item;
            }
        });

        return filtered;
    }, [data, debouncedSearchString]);

    const [selectedItem, setSelectedItem] = useState<WithKey<UniqueItem> | null>(null);

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

    const disableFilter = !Object.values(selectedFilters).some(val => val);

    return (
        <>
            <div className="grid gap-4">
                {Object.entries(UNIQUE_CATEGORIES).map(([category, subcategories]) =>
                    disableFilter || selectedFilters[category] ? (
                        <UniqueItemCategory
                            key={category}
                            data={displayedItems}
                            category={category as TopLevelCategory}
                            label={category}
                            subcategories={subcategories as BaseCategory[]}
                            selectedItem={selectedItem}
                            onClick={item => setSelectedItem(item ? item : null)}
                        />
                    ) : null
                )}
            </div>
            <UniqueItemDialog
                open={!!selectedItem}
                onOpenChange={open => !open && setSelectedItem(null)}
                item={selectedItem as UniqueItem}
            />
        </>
    );
}
