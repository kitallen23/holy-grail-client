import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { TopLevelCategory, UniqueBaseCategory, WithKey } from "@/routes/items/-types";
import { getSearchableText, ITEM_CATEGORIES } from "@/routes/items/-utils";
import { useDebouncedSearchString, useSearchFilters } from "@/stores/useSearchStore";
import type { UniqueItem } from "@/types/items";
import { useEffect, useMemo, useDeferredValue } from "react";
import UniqueItemCategory from "@/routes/-grail/unique/-UniqueItemCategory";
import { useShowItemList } from "@/hooks/useShowItemList";
import { useItemDialogStore } from "@/stores/useItemDialogStore";
import { useGrailData } from "@/hooks/useGrailData";
import { useDebounce } from "@/hooks/useDebounce";
import type { GrailProgressItem } from "@/lib/api";

const filterDisplayableItems = (
    hideFound: boolean,
    items: Record<string, UniqueItem>,
    grailProgress: Record<string, GrailProgressItem>
): Record<string, UniqueItem> => {
    const filteredItems: Record<string, UniqueItem> = {};
    if (hideFound) {
        Object.entries(items).forEach(([key, item]) => {
            const itemIsFound = grailProgress[key]?.found;
            if (!itemIsFound) {
                filteredItems[key] = item;
            }
        });
        return filteredItems;
    } else {
        return items;
    }
};

type Props = { uniqueItems: Record<string, UniqueItem> };

export default function UniqueItems({ uniqueItems }: Props) {
    const { debouncedSearchString } = useDebouncedSearchString();
    const { setFilteredItemCount } = useShowItemList();
    const { item: selectedItem, type: selectedItemType, setItem } = useItemDialogStore();
    const { selectedFilters } = useSearchFilters();
    const deferredSelectedFilters = useDeferredValue(selectedFilters);

    const { items } = useGrailData();
    const debouncedGrailProgress = useDebounce(items, 1000);

    const displayedItems: Record<string, UniqueItem> | undefined = useMemo(() => {
        if (!uniqueItems) {
            return uniqueItems;
        }
        const { "Hide Found Items": hideFoundItemsFilter, ...itemFilters } =
            deferredSelectedFilters;

        const searchTerms = getSearchTerms(debouncedSearchString);
        const filtered: Record<string, UniqueItem> = {};
        const hasActiveFilter = Object.values(itemFilters).some(val => val);

        Object.entries(uniqueItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                const itemType = Object.entries(ITEM_CATEGORIES).find(([, subcategories]) =>
                    subcategories.some(subcategory =>
                        item.category.endsWith(`Unique ${subcategory}`)
                    )
                )?.[0];

                if (!hasActiveFilter || itemFilters[`Unique ${itemType}`]) {
                    filtered[key] = item;
                }
            }
        });

        return filterDisplayableItems(hideFoundItemsFilter, filtered, debouncedGrailProgress ?? {});
    }, [uniqueItems, debouncedSearchString, deferredSelectedFilters, debouncedGrailProgress]);

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
