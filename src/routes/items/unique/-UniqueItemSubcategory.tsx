import HeadingSeparator from "@/components/HeadingSeparator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BaseCategory, UniqueItemArrayItem, WithKey } from "@/routes/items/-types";
import type { UniqueItem } from "@/types/items";
import { useMemo } from "react";

function getFilteredUniqueItems(
    data: UniqueItemArrayItem[],
    subcategory: BaseCategory
): UniqueItemArrayItem[] {
    if (!data) {
        return [];
    }

    const categoryUniqueItems = data
        .filter(item => item.category.endsWith(`Unique ${subcategory}`))
        .sort((a, b) => (a.name > b.name ? 1 : 0));

    return categoryUniqueItems;
}

interface UniqueItemSubcategoryProps {
    data: UniqueItemArrayItem[];
    subcategory: BaseCategory;
    label: string;
    selectedItem?: WithKey<UniqueItem> | null;
    onClick: (item: UniqueItemArrayItem | null) => void;
}

export default function UniqueItemSubcategory({
    data,
    subcategory,
    label,
    selectedItem,
    onClick,
}: UniqueItemSubcategoryProps) {
    const displayedSubcategoryItems = useMemo(
        () => getFilteredUniqueItems(data, subcategory),
        [data, subcategory]
    );

    if (!displayedSubcategoryItems.length) {
        return null;
    }

    return (
        <>
            <HeadingSeparator color="text-primary">{label}</HeadingSeparator>
            <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {displayedSubcategoryItems.map(item => (
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
        </>
    );
}
