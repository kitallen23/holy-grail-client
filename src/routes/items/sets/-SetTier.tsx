import type { SetItemArrayItem, WithKey } from "@/routes/items/-types";
import ItemSet from "@/routes/items/sets/-ItemSet";
import { SETS } from "@/routes/items/sets/-utils";
import type { SetItem, Tier } from "@/types/items";
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
        .sort((a, b) => (a.name > b.name ? 1 : 0));

    return tierSetItems;
}

interface SetTierProps {
    data: Record<string, SetItem> | null;
    tier: Tier;
    selectedItem?: WithKey<SetItem> | null;
    onClick: (item: SetItemArrayItem | null) => void;
}

export default function SetTier({ data, tier, selectedItem, onClick }: SetTierProps) {
    const displayedSetItems = useMemo(() => getFilteredTierSetItems(data, tier), [data, tier]);

    if (!displayedSetItems.length) {
        return null;
    }

    return (
        <div className="grid gap-4 content-start [&:not(:first-child)]:mt-4">
            <h2 className="text-2xl font-semibold tracking-tight pb-1 text-destructive font-diablo text-center">
                {tier}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
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
