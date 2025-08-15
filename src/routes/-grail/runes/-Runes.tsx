import CheckboxItem from "@/components/CheckboxItem";
import HeadingSeparator from "@/components/HeadingSeparator";
import { useDebounce } from "@/hooks/useDebounce";
import { useGrailData } from "@/hooks/useGrailData";
import { useShowItemList } from "@/hooks/useShowItemList";
import type { GrailProgressItem } from "@/lib/api";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { RuneArrayItem, WithKey } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import { useItemDialogStore } from "@/stores/useItemDialogStore";
import { useDebouncedSearchString, useSearchFilters } from "@/stores/useSearchStore";
import type { Rune } from "@/types/items";
import clsx from "clsx";
import { useEffect, useMemo, useDeferredValue } from "react";

const filterDisplayableRunes = (
    hideFound: boolean,
    runes: WithKey<Rune>[],
    grailProgress: Record<string, GrailProgressItem>
) => {
    if (hideFound) {
        return runes.filter(rune => (grailProgress[rune.key] ? false : true));
    } else {
        return runes;
    }
};

type Props = { runes: Record<string, Rune> };

export default function Runes({ runes }: Props) {
    const { debouncedSearchString } = useDebouncedSearchString();
    const { shouldDisplay, setFilteredItemCount } = useShowItemList();
    const { item: selectedItem, type: selectedItemType, setItem } = useItemDialogStore();
    const { selectedFilters } = useSearchFilters();
    const deferredSelectedFilters = useDeferredValue(selectedFilters);

    const { items } = useGrailData();
    const debouncedGrailProgress = useDebounce(items, 1000);

    const displayedRunes: RuneArrayItem[] = useMemo(() => {
        const { "Hide Found Items": hideFoundItemsFilter, ...itemFilters } =
            deferredSelectedFilters;

        if (!runes || !debouncedSearchString.trim()) {
            const displayableRunes = Object.entries(runes || {}).map(([key, value]) => ({
                ...value,
                key,
            }));
            return filterDisplayableRunes(
                hideFoundItemsFilter,
                displayableRunes,
                debouncedGrailProgress ?? {}
            );
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        if (searchTerms.length === 0) {
            const displayableRunes = Object.entries(runes || {}).map(([key, value]) => ({
                ...value,
                key,
            }));
            return filterDisplayableRunes(
                hideFoundItemsFilter,
                displayableRunes,
                debouncedGrailProgress ?? {}
            );
        }

        const filtered: Record<string, Rune> = {};
        const hasActiveFilter = Object.values(itemFilters).some(val => val);

        Object.entries(runes).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                if (!hasActiveFilter || itemFilters["Runes"]) {
                    filtered[key] = item;
                }
            }
        });

        const displayableRunes = Object.entries(filtered).map(([key, value]) => ({
            ...value,
            key,
        }));
        return filterDisplayableRunes(
            hideFoundItemsFilter,
            displayableRunes,
            debouncedGrailProgress ?? {}
        );
    }, [runes, debouncedSearchString, deferredSelectedFilters, debouncedGrailProgress]);

    useEffect(() => {
        setFilteredItemCount("rune", displayedRunes.length);
    }, [displayedRunes]);

    const hasActiveFilter = Object.values(deferredSelectedFilters).some(val => val);
    if (hasActiveFilter && !deferredSelectedFilters["Runes"]) {
        return null;
    }

    if (!Object.keys(displayedRunes).length) {
        return null;
    }

    return (
        <>
            <div
                className={clsx("grid gap-4 [&:not(:first-child)]:mt-4", {
                    hidden: !shouldDisplay,
                })}
            >
                <HeadingSeparator className="text-diablo-orange">Runes</HeadingSeparator>
                <div className="grid gap-1 grid-cols-3 md:grid-cols-6">
                    {displayedRunes.map(rune => (
                        <CheckboxItem
                            key={rune.key}
                            name={rune.name}
                            uniqueName={rune.key}
                            isSelected={
                                selectedItemType === "rune" && selectedItem?.key === rune.key
                            }
                            data={rune}
                            onClick={() => setItem("rune", rune)}
                            imageSrc={`/img/${rune.key.toLowerCase()}.webp`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
