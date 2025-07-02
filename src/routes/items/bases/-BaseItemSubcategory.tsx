import HeadingSeparator from "@/components/HeadingSeparator";
import { Button } from "@/components/ui/button";
import type { BaseItemArrayItem, WithKey } from "@/routes/items/-types";
import { tierOrder } from "@/routes/items/bases/-utils";
import type { BaseCategory, BaseItem } from "@/types/items";
import clsx from "clsx";
import { useMemo } from "react";

function getFilteredBaseItems(
    data: BaseItemArrayItem[],
    subcategory: BaseCategory
): BaseItemArrayItem[] {
    if (!data) {
        return [];
    }

    const categoryBaseItems = data
        .filter(item => item.category === subcategory)
        .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

    return categoryBaseItems;
}

interface BaseItemSubcategoryProps {
    data: BaseItemArrayItem[];
    subcategory: BaseCategory;
    label: string;
    selectedItem?: WithKey<BaseItem> | null;
    onClick: (item: BaseItemArrayItem | null) => void;
}

export default function BaseItemSubcategory({
    data,
    subcategory,
    label,
    selectedItem,
    onClick,
}: BaseItemSubcategoryProps) {
    const displayedSubcategoryItems = useMemo(
        () => getFilteredBaseItems(data, subcategory),
        [data, subcategory]
    );

    if (!displayedSubcategoryItems.length) {
        return null;
    }

    return (
        <>
            <HeadingSeparator color="text-foreground">{label}</HeadingSeparator>
            <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {displayedSubcategoryItems.map(item => (
                    <Button
                        key={item.key}
                        variant="ghost"
                        color="primary"
                        size="sm"
                        className={clsx(
                            "item-trigger justify-start border border-transparent inline-flex w-fit max-w-full",
                            item.key === selectedItem?.key ? "border-primary" : ""
                        )}
                        onClick={() => onClick(item)}
                        aria-haspopup="dialog"
                        aria-label={`View details for ${item.name}`}
                    >
                        <div className="text-nowrap truncate">{item.name}</div>
                        <div className="pl-0 sm:pl-1 text-foreground/60 truncate">{item.tier}</div>
                    </Button>
                ))}
            </div>
        </>
    );
}
