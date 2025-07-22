import HeadingSeparator from "@/components/HeadingSeparator";
import { Button } from "@/components/ui/button";
import type { UniqueBaseCategory, UniqueItemArrayItem, WithKey } from "@/routes/items/-types";
import type { UniqueItem } from "@/types/items";
import clsx from "clsx";
import { useMemo } from "react";

function getFilteredUniqueItems(
    data: UniqueItemArrayItem[],
    subcategory: UniqueBaseCategory
): UniqueItemArrayItem[] {
    if (!data) {
        return [];
    }

    let categoryUniqueItems = data.filter(item => item.category.endsWith(`Unique ${subcategory}`));

    if (subcategory !== "Charms") {
        categoryUniqueItems = categoryUniqueItems.sort((a, b) => (a.name > b.name ? 1 : 0));
    }

    return categoryUniqueItems;
}

interface UniqueItemSubcategoryProps {
    data: UniqueItemArrayItem[];
    subcategory: UniqueBaseCategory;
    label: string;
    selectedItem?: WithKey<UniqueItem>;
    onClick: (item?: UniqueItemArrayItem) => void;
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
            <HeadingSeparator className="text-primary">{label}</HeadingSeparator>
            <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {displayedSubcategoryItems.map(item => (
                    <Button
                        key={item.key}
                        variant="ghost"
                        size="sm"
                        className={clsx(
                            "item-trigger justify-start border border-transparent inline-flex w-fit max-w-full",
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
