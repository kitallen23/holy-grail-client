import type { DialogContent } from "@/components/ui/dialog";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { WithKey } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import { useDebouncedSearch } from "@/stores/useSearchStore";
import type { BaseItem, SetItem, Tier } from "@/types/items";
import { useMemo, useRef, useState } from "react";
import BaseItemDialog from "@/components/ItemTooltip/BaseItemDialog";
import SetItemDialog from "@/components/ItemTooltip/SetItemDialog";
import SetTier from "@/routes/-grail/sets/SetTier";

type Props = { setItems: Record<string, SetItem>; baseItems: Record<string, BaseItem> };

const TIERS: Tier[] = ["Normal", "Exceptional", "Elite"];

export default function SetItems({ setItems, baseItems }: Props) {
    const { debouncedSearchString } = useDebouncedSearch();

    const displayedItems: Record<string, SetItem> | undefined = useMemo(() => {
        if (!setItems) {
            return setItems;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);

        const filtered: Record<string, SetItem> = {};

        Object.entries(setItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered[key] = item;
            }
        });

        return filtered;
    }, [setItems, debouncedSearchString]);

    const [selectedItem, setSelectedItem] = useState<WithKey<SetItem> | null>(null);
    const [selectedBaseItem, setSelectedBaseItem] = useState<WithKey<BaseItem> | null>(null);
    const dialogRef = useRef<React.ComponentRef<typeof DialogContent>>(null);
    const baseDialogRef = useRef<React.ComponentRef<typeof DialogContent>>(null);

    const handleSetItemClick = (itemName: string) => {
        const [key, setItem] =
            Object.entries(setItems || {}).find(([, item]) => item.name === itemName) || [];
        if (key && setItem) {
            setSelectedItem({ ...setItem, key });
        }
        dialogRef.current?.scrollTo(0, 0);
    };
    const handleBaseItemClick = (itemName: string) => {
        const [key, baseItem] =
            Object.entries(baseItems || {}).find(([, item]) => item.name === itemName) || [];
        if (key && baseItem) {
            setSelectedBaseItem({ ...baseItem, key });
        }
        setSelectedItem(null);
        baseDialogRef.current?.scrollTo(0, 0);
    };

    if (!Object.keys(displayedItems).length) {
        return null;
    }
    return (
        <>
            <div className="grid gap-4">
                {TIERS.map(tier => (
                    <SetTier
                        key={tier}
                        data={displayedItems}
                        tier={tier}
                        selectedItem={selectedItem}
                        onClick={item => setSelectedItem(item || null)}
                    />
                ))}
            </div>
            <SetItemDialog
                ref={dialogRef}
                open={!!selectedItem}
                onOpenChange={open => !open && setSelectedItem(null)}
                item={selectedItem as SetItem}
                onSetItemClick={handleSetItemClick}
                onBaseItemClick={handleBaseItemClick}
            />
            <BaseItemDialog
                ref={baseDialogRef}
                open={!!selectedBaseItem}
                onOpenChange={open => !open && setSelectedBaseItem(null)}
                item={selectedBaseItem as BaseItem}
                onBaseItemClick={handleBaseItemClick}
            />
        </>
    );
}
