import HeadingSeparator from "@/components/HeadingSeparator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SetItemArrayItem, WithKey } from "@/routes/items/-types";
import type { SetCategory, SetItem } from "@/types/items";
import { useMemo } from "react";

function getFilteredSetItems(data: SetItemArrayItem[], set: SetCategory): SetItemArrayItem[] {
    if (!data) {
        return [];
    }

    const categorySetItems = data
        .filter(item => item.category === set)
        .sort((a, b) => (a.name > b.name ? 1 : 0));

    return categorySetItems;
}

interface SetCategoryProps {
    data: SetItemArrayItem[];
    set: SetCategory;
    label: string;
    selectedItem?: WithKey<SetItem> | null;
    onClick: (item: SetItemArrayItem | null) => void;
}

export default function ItemSet({ data, set, label, selectedItem, onClick }: SetCategoryProps) {
    const displayedSetItems = useMemo(() => getFilteredSetItems(data, set), [data, set]);

    if (!displayedSetItems.length) {
        return null;
    }

    return (
        <div className="grid gap-4 content-start">
            <HeadingSeparator color="text-diablo-green">{label}</HeadingSeparator>
            <div className="grid gap-1">
                {displayedSetItems.map(item => (
                    <Button
                        key={item.key}
                        variant="ghost"
                        color="primary"
                        size="sm"
                        className={cn(
                            "item-trigger justify-start border border-transparent",
                            item.key === selectedItem?.key ? "border-primary" : ""
                        )}
                        onClick={() => onClick(item)}
                        aria-haspopup="dialog"
                        aria-label={`View details for ${item.name}`}
                    >
                        <div className="text-nowrap truncate">{item.key}</div>
                        <div className="pl-0 sm:pl-1 text-foreground/60 truncate">{item.type}</div>
                    </Button>
                ))}
            </div>
        </div>
    );
}
