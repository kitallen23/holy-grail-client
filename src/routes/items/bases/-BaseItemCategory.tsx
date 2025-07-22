import { useMemo } from "react";

import type { BaseCategory, BaseItem } from "@/types/items";
import type { BaseItemArrayItem, TopLevelCategory, WithKey } from "@/routes/items/-types";
import { ITEM_CATEGORIES } from "@/routes/items/-utils";
import BaseItemSubcategory from "@/routes/items/bases/-BaseItemSubcategory";
import { tierOrder } from "@/routes/items/bases/-utils";
import Heading from "@/components/Heading";

function getFilteredBaseItems(
    data: Record<string, BaseItem> | null,
    category: TopLevelCategory
): BaseItemArrayItem[] {
    if (!data) {
        return [];
    }

    const categoryBaseItems = Object.entries(data)
        .map(([key, value]) => ({
            ...value,
            key,
        }))
        .filter(item =>
            ITEM_CATEGORIES[category].some(subcategory => item.category === subcategory)
        )
        .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

    return categoryBaseItems;
}

interface BaseItemCategoryProps {
    data: Record<string, BaseItem> | null;
    category: "Weapons" | "Armor" | "Other";
    subcategories: BaseCategory[];
    label: string;
    selectedItem?: WithKey<BaseItem>;
    onClick: (item?: BaseItemArrayItem) => void;
}

export default function BaseItemCategory({
    data,
    category,
    subcategories,
    label,
    selectedItem,
    onClick,
}: BaseItemCategoryProps) {
    const displayedCategoryItems = useMemo(
        () => getFilteredBaseItems(data, category),
        [data, category]
    );

    if (!displayedCategoryItems.length) {
        return null;
    }

    return (
        <div className="grid gap-4 [&:not(:first-child)]:mt-4">
            <Heading className="text-destructive">{label}</Heading>
            {subcategories.map(subcategory => (
                <BaseItemSubcategory
                    key={`${category}-${subcategory}`}
                    data={displayedCategoryItems}
                    subcategory={subcategory as BaseCategory}
                    label={subcategory === "Armor" ? "Body Armor" : subcategory}
                    selectedItem={selectedItem}
                    onClick={onClick}
                />
            ))}
        </div>
    );
}
