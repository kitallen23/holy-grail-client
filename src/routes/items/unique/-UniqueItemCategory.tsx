import { useMemo } from "react";

import type { UniqueItem } from "@/types/items";
import UniqueItemSubcategory from "@/routes/items/unique/-UniqueItemSubcategory";
import type {
    TopLevelCategory,
    UniqueBaseCategory,
    UniqueItemArrayItem,
    WithKey,
} from "@/routes/items/-types";
import { ITEM_CATEGORIES } from "@/routes/items/-utils";
import Heading from "@/components/Heading";

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
            ITEM_CATEGORIES[category].some(subcategory =>
                item.category.endsWith(`Unique ${subcategory}`)
            )
        );

    return categoryUniqueItems;
}

interface UniqueItemCategoryProps {
    data: Record<string, UniqueItem> | null;
    category: "Weapons" | "Armor" | "Other";
    subcategories: UniqueBaseCategory[];
    label: string;
    selectedItem?: WithKey<UniqueItem>;
    onClick: (item?: UniqueItemArrayItem) => void;
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
        <div className="grid gap-4 [&:not(:first-child)]:mt-4">
            <Heading className="text-destructive">{label}</Heading>
            {subcategories.map(subcategory => (
                <UniqueItemSubcategory
                    key={`${category}-${subcategory}`}
                    data={displayedCategoryItems}
                    subcategory={subcategory as UniqueBaseCategory}
                    label={subcategory === "Armor" ? "Body Armor" : subcategory}
                    selectedItem={selectedItem}
                    onClick={onClick}
                />
            ))}
        </div>
    );
}
