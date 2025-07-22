import CheckboxItem from "@/components/CheckboxItem";
import HeadingSeparator from "@/components/HeadingSeparator";
import type { UniqueBaseCategory, UniqueItemArrayItem, WithKey } from "@/routes/items/-types";
import type { UniqueItem } from "@/types/items";
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
    onClick: (item: UniqueItemArrayItem) => void;
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
                    <CheckboxItem
                        key={item.key}
                        name={item.name}
                        uniqueName={item.key}
                        isSelected={selectedItem?.key === item.key}
                        data={item}
                        onClick={onClick}
                        subtext={item.type}
                    />
                ))}
            </div>
        </>
    );
}
