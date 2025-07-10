import type { DialogContent } from "@/components/ui/dialog";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { TopLevelCategory, UniqueBaseCategory, WithKey } from "@/routes/items/-types";
import { getSearchableText, ITEM_CATEGORIES } from "@/routes/items/-utils";
import { useDebouncedSearch } from "@/stores/useSearchStore";
import type { BaseItem, UniqueItem } from "@/types/items";
import { useEffect, useMemo, useRef, useState } from "react";
import UniqueItemCategory from "@/routes/-grail/unique/UniqueItemCategory";
import UniqueItemDialog from "@/components/ItemTooltip/UniqueItemDialog";
import BaseItemDialog from "@/components/ItemTooltip/BaseItemDialog";
import { useShowItemList } from "@/hooks/useShowItemList";

type Props = { uniqueItems: Record<string, UniqueItem>; baseItems: Record<string, BaseItem> };

export default function UniqueItems({ uniqueItems, baseItems }: Props) {
    const { debouncedSearchString } = useDebouncedSearch();
    const { shouldDisplay, setFilteredItemCount } = useShowItemList();

    const displayedItems: Record<string, UniqueItem> | undefined = useMemo(() => {
        if (!uniqueItems) {
            return uniqueItems;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        const filtered: Record<string, UniqueItem> = {};

        Object.entries(uniqueItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered[key] = item;
            }
        });

        return filtered;
    }, [uniqueItems, debouncedSearchString]);

    useEffect(() => {
        setFilteredItemCount("unique", Object.keys(displayedItems).length);
    }, [displayedItems]);

    const [selectedItem, setSelectedItem] = useState<WithKey<UniqueItem> | null>(null);
    const [selectedBaseItem, setSelectedBaseItem] = useState<WithKey<BaseItem> | null>(null);
    const baseDialogRef = useRef<React.ComponentRef<typeof DialogContent>>(null);

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
            {Object.entries(ITEM_CATEGORIES).map(([category, subcategories]) => (
                <UniqueItemCategory
                    key={category}
                    data={displayedItems}
                    category={category as TopLevelCategory}
                    label={category}
                    subcategories={subcategories as UniqueBaseCategory[]}
                    selectedItem={selectedItem}
                    onClick={item => setSelectedItem(item ? item : null)}
                />
            ))}
            {shouldDisplay ? (
                <>
                    <UniqueItemDialog
                        open={!!selectedItem}
                        onOpenChange={open => !open && setSelectedItem(null)}
                        item={selectedItem as UniqueItem}
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
