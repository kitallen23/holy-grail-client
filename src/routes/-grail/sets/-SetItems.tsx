import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { SetItemArrayItem, WithKey } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import { useDebouncedSearchString, useSearchFilters } from "@/stores/useSearchStore";
import type { SetItem } from "@/types/items";
import { useEffect, useMemo, useDeferredValue } from "react";
import { SETS } from "@/routes/items/sets/-utils";
import ItemSet from "@/routes/-grail/sets/-ItemSet";
import clsx from "clsx";
import Heading from "@/components/Heading";
import { useShowItemList } from "@/hooks/useShowItemList";
import { useItemDialogStore } from "@/stores/useItemDialogStore";
import { useGrailData } from "@/hooks/useGrailData";
import { useDebounce } from "@/hooks/useDebounce";
import type { GrailProgressItem } from "@/lib/api";

const filterDisplayableItems = (
    hideFound: boolean,
    items: Record<string, SetItem>,
    grailProgress: Record<string, GrailProgressItem>
): Record<string, SetItem> => {
    const filteredItems: Record<string, SetItem> = {};
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

type Props = { setItems: Record<string, SetItem> };

function getSetItems(data: Record<string, SetItem> | null): SetItemArrayItem[] {
    if (!data) {
        return [];
    }

    const tierSetItems = Object.entries(data)
        .map(([key, value]) => ({
            ...value,
            key,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return tierSetItems;
}

export default function SetItems({ setItems }: Props) {
    const { debouncedSearchString } = useDebouncedSearchString();
    const { shouldDisplay, setFilteredItemCount } = useShowItemList();
    const { item: selectedItem, type: selectedItemType, setItem } = useItemDialogStore();
    const { selectedFilters } = useSearchFilters();
    const deferredSelectedFilters = useDeferredValue(selectedFilters);

    const { items } = useGrailData();
    const debouncedGrailProgress = useDebounce(items, 1000);

    const displayedItems: Record<string, SetItem> | undefined = useMemo(() => {
        if (!setItems) {
            return setItems;
        }
        const { "Hide Found Items": hideFoundItemsFilter, ...itemFilters } =
            deferredSelectedFilters;

        const searchTerms = getSearchTerms(debouncedSearchString);

        const filtered: Record<string, SetItem> = {};
        const hasActiveFilter = Object.values(itemFilters).some(val => val);

        Object.entries(setItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                if (!hasActiveFilter || itemFilters["Set Items"]) {
                    filtered[key] = item;
                }
            }
        });

        return filterDisplayableItems(hideFoundItemsFilter, filtered, debouncedGrailProgress ?? {});
    }, [setItems, debouncedSearchString, deferredSelectedFilters, debouncedGrailProgress]);

    useEffect(() => {
        setFilteredItemCount("set", Object.keys(displayedItems).length);
    }, [displayedItems]);

    const displayedSetItems = useMemo(() => getSetItems(displayedItems), [displayedItems]);
    const numberOfDisplayedSets = new Set(displayedSetItems.map(item => item.category)).size;

    if (!Object.keys(displayedItems).length) {
        return null;
    }
    return (
        <>
            <div
                className={clsx("grid gap-4 [&:not(:first-child)]:mt-4", {
                    hidden: !shouldDisplay,
                })}
            >
                <Heading className="text-destructive">Sets</Heading>
                <div
                    className={clsx(
                        "grid gap-4",
                        numberOfDisplayedSets === 1 ? "" : "md:grid-cols-2"
                    )}
                >
                    {SETS.map(({ name }) => (
                        <ItemSet
                            key={name}
                            data={displayedSetItems}
                            set={name}
                            label={name}
                            selectedItem={
                                selectedItemType === "set-item"
                                    ? (selectedItem as WithKey<SetItem>)
                                    : undefined
                            }
                            onClick={item => setItem("set-item", item)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
