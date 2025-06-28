import { useMemo } from "react";

import type { UniqueItem } from "@/types/items";
import UniqueItemSubcategory from "@/routes/items/unique/-UniqueItemSubcategory";
import type {
    BaseCategory,
    TopLevelCategory,
    UniqueItemArrayItem,
    WithKey,
} from "@/routes/items/-types";
import { UNIQUE_CATEGORIES } from "@/routes/items/unique/-utils";

function getFilteredUniqueItems(
    data: Record<string, UniqueItem> | null,
    category: TopLevelCategory
): UniqueItemArrayItem[] {
    if (!data) {
        return [];
    }

    const categoryUniqueItems = Object.entries(data)
        .map(([key, value]) => ({
            ...value,
            key,
        }))
        .filter(item =>
            UNIQUE_CATEGORIES[category].some(subcategory =>
                item.category.endsWith(`Unique ${subcategory}`)
            )
        )
        .sort((a, b) => (a.name > b.name ? 1 : 0));

    return categoryUniqueItems;
}

interface UniqueItemCategoryProps {
    data: Record<string, UniqueItem> | null;
    category: "Weapons" | "Armor" | "Other";
    subcategories: BaseCategory[];
    label: string;
    selectedItem?: WithKey<UniqueItem> | null;
    onClick: (item: UniqueItemArrayItem | null) => void;
}

export default function UniqueItemCategory({
    data,
    category,
    subcategories,
    label,
    selectedItem,
    onClick,
}: UniqueItemCategoryProps) {
    const displayedCategoryItems = useMemo(
        () => getFilteredUniqueItems(data, category),
        [data, category]
    );

    if (!displayedCategoryItems.length) {
        return null;
    }

    return (
        <div key={category} className="grid gap-4">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pb-1 [&:not(:first-child)]:mt-10 text-destructive font-diablo text-center">
                {label}
            </h2>
            {subcategories.map(subcategory => (
                <UniqueItemSubcategory
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
