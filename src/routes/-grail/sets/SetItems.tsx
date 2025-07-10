import type { DialogContent } from "@/components/ui/dialog";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { SetItemArrayItem, WithKey } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import { useDebouncedSearch } from "@/stores/useSearchStore";
import type { BaseItem, SetItem } from "@/types/items";
import { useEffect, useMemo, useRef, useState } from "react";
import BaseItemDialog from "@/components/ItemTooltip/BaseItemDialog";
import SetItemDialog from "@/components/ItemTooltip/SetItemDialog";
import { SETS } from "@/routes/items/sets/-utils";
import ItemSet from "@/routes/-grail/sets/ItemSet";
import clsx from "clsx";
import Heading from "@/components/Heading";
import { useShowItemList } from "@/hooks/useShowItemList";

type Props = { setItems: Record<string, SetItem>; baseItems: Record<string, BaseItem> };

function getSetItems(data: Record<string, SetItem> | null): SetItemArrayItem[] {
    if (!data) {
        return [];
    }

    const tierSetItems = Object.entries(data)
        .map(([key, value]) => ({
            ...value,
            key,
        }))
        .sort((a, b) => (a.name > b.name ? 1 : 0));

    return tierSetItems;
}

export default function SetItems({ setItems, baseItems }: Props) {
    const { debouncedSearchString } = useDebouncedSearch();
    const { shouldDisplay, setFilteredItemCount } = useShowItemList();

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

    useEffect(() => {
        setFilteredItemCount("set", Object.keys(displayedItems).length);
    }, [displayedItems]);

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
                            selectedItem={selectedItem}
                            onClick={item => setSelectedItem(item || null)}
                        />
                    ))}
                </div>
            </div>
            {shouldDisplay ? (
                <>
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
            ) : null}
        </>
    );
}
