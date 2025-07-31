import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { TopLevelCategory, UniqueBaseCategory, WithKey } from "@/routes/items/-types";
import { getSearchableText, ITEM_CATEGORIES } from "@/routes/items/-utils";
import { useDebouncedSearch, useSearchFilters } from "@/stores/useSearchStore";
import type { UniqueItem } from "@/types/items";
import { useEffect, useMemo } from "react";
import UniqueItemCategory from "@/routes/-grail/unique/-UniqueItemCategory";
import { useShowItemList } from "@/hooks/useShowItemList";
import { useItemDialogStore } from "@/stores/useItemDialogStore";

type Props = { uniqueItems: Record<string, UniqueItem> };

export default function UniqueItems({ uniqueItems }: Props) {
    const { debouncedSearchString } = useDebouncedSearch();
    const { setFilteredItemCount } = useShowItemList();
    const { item: selectedItem, type: selectedItemType, setItem } = useItemDialogStore();
    const { selectedFilters } = useSearchFilters();

    const displayedItems: Record<string, UniqueItem> | undefined = useMemo(() => {
        if (!uniqueItems) {
            return uniqueItems;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        const filtered: Record<string, UniqueItem> = {};
        const hasActiveFilter = Object.values(selectedFilters).some(val => val);

        Object.entries(uniqueItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                const itemType = Object.entries(ITEM_CATEGORIES).find(([, subcategories]) =>
                    subcategories.some(subcategory =>
                        item.category.endsWith(`Unique ${subcategory}`)
                    )
                )?.[0];

                if (!hasActiveFilter || selectedFilters[`Unique ${itemType}`]) {
                    filtered[key] = item;
                }
            }
        });

        return filtered;
    }, [uniqueItems, debouncedSearchString, selectedFilters]);

    useEffect(() => {
        setFilteredItemCount("unique", Object.keys(displayedItems).length);
    }, [displayedItems]);

    if (!Object.keys(displayedItems).length) {
        return null;
    }
    return (
        <>
            {Object.entries(ITEM_CATEGORIES).map(([category, subcategories]) => (
                <UniqueItemCategory
                    key={category}
                    data={displayedItems}
                    category={category as TopLevelCategory}
                    label={category}
                    subcategories={subcategories as UniqueBaseCategory[]}
                    selectedItem={
                        selectedItemType === "unique-item"
                            ? (selectedItem as WithKey<UniqueItem>)
                            : undefined
                    }
                    onClick={item => setItem("unique-item", item)}
                />
            ))}
        </>
    );
}
