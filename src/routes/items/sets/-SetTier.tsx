import Heading from "@/components/Heading";
import type { SetItemArrayItem, WithKey } from "@/routes/items/-types";
import ItemSet from "@/routes/items/sets/-ItemSet";
import { SETS } from "@/routes/items/sets/-utils";
import type { SetItem, Tier } from "@/types/items";
import clsx from "clsx";
import { useMemo } from "react";

function getFilteredTierSetItems(
    data: Record<string, SetItem> | null,
    tier: Tier
): SetItemArrayItem[] {
    if (!data) {
        return [];
    }

    const tierSetItems = Object.entries(data)
        .map(([key, value]) => ({
            ...value,
            key,
        }))
        .filter(item => {
            const setTier = SETS.find(set => set.name === item.category)?.tier;
            return setTier === tier;
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    return tierSetItems;
}

interface SetTierProps {
    data: Record<string, SetItem> | null;
    tier: Tier;
    selectedItem?: WithKey<SetItem>;
    onClick: (item?: SetItemArrayItem) => void;
}

export default function SetTier({ data, tier, selectedItem, onClick }: SetTierProps) {
    const displayedSetItems = useMemo(() => getFilteredTierSetItems(data, tier), [data, tier]);
    const numberOfDisplayedSets = new Set(displayedSetItems.map(item => item.category)).size;

    if (!displayedSetItems.length) {
        return null;
    }

    return (
        <div className="grid gap-4 content-start [&:not(:first-child)]:mt-4">
            <Heading className="text-destructive">{tier}</Heading>
            <div
                className={clsx("grid gap-4", numberOfDisplayedSets === 1 ? "" : "md:grid-cols-2")}
            >
                {SETS.map(({ name }) => (
                    <ItemSet
                        key={name}
                        data={displayedSetItems}
                        set={name}
                        label={name}
                        selectedItem={selectedItem}
                        onClick={onClick}
                    />
                ))}
            </div>
        </div>
    );
}
