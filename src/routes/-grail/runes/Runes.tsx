import CheckboxItem from "@/components/CheckboxItem";
import HeadingSeparator from "@/components/HeadingSeparator";
import { useShowItemList } from "@/hooks/useShowItemList";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { RuneArrayItem } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import { useItemDialogStore } from "@/stores/useItemDialogStore";
import { useDebouncedSearch, useSearchFilters } from "@/stores/useSearchStore";
import type { Rune } from "@/types/items";
import clsx from "clsx";
import { useEffect, useMemo } from "react";

type Props = { runes: Record<string, Rune> };

export default function Runes({ runes }: Props) {
    const { debouncedSearchString } = useDebouncedSearch();
    const { shouldDisplay, setFilteredItemCount } = useShowItemList();
    const { item: selectedItem, type: selectedItemType, setItem } = useItemDialogStore();
    const { selectedFilters } = useSearchFilters();

    const displayedRunes: RuneArrayItem[] = useMemo(() => {
        if (!runes || !debouncedSearchString.trim()) {
            return Object.entries(runes || {}).map(([key, value]) => ({
                ...value,
                key,
            }));
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        if (searchTerms.length === 0) {
            return Object.entries(runes || {}).map(([key, value]) => ({
                ...value,
                key,
            }));
        }

        const filtered: Record<string, Rune> = {};
        const hasActiveFilter = Object.values(selectedFilters).some(val => val);

        Object.entries(runes).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                if (!hasActiveFilter || selectedFilters["Runes"]) {
                    filtered[key] = item;
                }
            }
        });

        return Object.entries(filtered).map(([key, value]) => ({
            ...value,
            key,
        }));
    }, [runes, debouncedSearchString, selectedFilters]);

    useEffect(() => {
        setFilteredItemCount("rune", displayedRunes.length);
    }, [displayedRunes]);

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
