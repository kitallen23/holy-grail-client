import CheckboxItem from "@/components/CheckboxItem";
import HeadingSeparator from "@/components/HeadingSeparator";
import RuneDialog from "@/components/ItemTooltip/RuneDialog";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { RuneArrayItem, WithKey } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import { useDebouncedSearch } from "@/stores/useSearchStore";
import type { Rune } from "@/types/items";
import { useMemo, useState } from "react";

type Props = { runes: Record<string, Rune> };

export default function Runes({ runes }: Props) {
    const { debouncedSearchString } = useDebouncedSearch();

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

        Object.entries(runes).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered[key] = item;
            }
        });

        return Object.entries(filtered).map(([key, value]) => ({
            ...value,
            key,
        }));
    }, [runes, debouncedSearchString]);

    const [selectedRune, setSelectedRune] = useState<WithKey<Rune> | null>(null);

    if (!Object.keys(displayedRunes).length) {
        return null;
    }

    return (
        <>
            <div className="grid gap-4 [&:not(:first-child)]:mt-4">
                <HeadingSeparator className="text-diablo-orange">Runes</HeadingSeparator>
                <div className="grid gap-1 grid-cols-3 md:grid-cols-6">
                    {displayedRunes.map(rune => (
                        <CheckboxItem
                            key={rune.key}
                            name={rune.name}
                            uniqueName={rune.key}
                            isSelected={selectedRune?.key === rune.key}
                            data={rune}
                            onClick={() => setSelectedRune(rune)}
                            imageSrc={`/img/${rune.key.toLowerCase()}.webp`}
                        />
                    ))}
                </div>
            </div>
            <RuneDialog
                open={!!selectedRune}
                onOpenChange={open => !open && setSelectedRune(null)}
                rune={selectedRune as Rune}
            />
        </>
    );
}
