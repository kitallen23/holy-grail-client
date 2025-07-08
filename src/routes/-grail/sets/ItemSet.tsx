import CheckboxItem from "@/components/CheckboxItem";
import HeadingSeparator from "@/components/HeadingSeparator";
import type { SetItemArrayItem, WithKey } from "@/routes/items/-types";
import type { SetCategory, SetItem } from "@/types/items";
import { useMemo } from "react";

function getFilteredSetItems(data: SetItemArrayItem[], set: SetCategory): SetItemArrayItem[] {
    if (!data) {
        return [];
    }

    const categorySetItems = data.filter(item => item.category === set);
    const setOrder = Object.fromEntries(
        categorySetItems[0]?.setItems.map((item, i) => [item, i++]) ?? []
    );

    const sortedCategorySetItems = categorySetItems.sort((a, b) => {
        const orderA = setOrder[a.name] ?? Infinity;
        const orderB = setOrder[b.name] ?? Infinity;
        return orderA - orderB;
    });
    return sortedCategorySetItems;
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
            <HeadingSeparator className="text-diablo-green">{label}</HeadingSeparator>
            <div className="grid gap-1">
                {displayedSetItems.map(item => (
                    <CheckboxItem
                        key={item.key}
                        name={item.name}
                        uniqueName={item.key}
                        isSelected={selectedItem?.key === item.key}
                        data={item}
                        onClick={onClick}
                        subtext={item.type}
                    />
                    // <Button
                    //     key={item.key}
                    //     variant="ghost"
                    //     size="sm"
                    //     className={clsx(
                    //         "item-trigger justify-start border border-transparent inline-flex w-fit max-w-full",
                    //         item.key === selectedItem?.key ? "border-primary" : ""
                    //     )}
                    //     onClick={() => onClick(item)}
                    //     aria-haspopup="dialog"
                    //     aria-label={`View details for ${item.name}`}
                    // >
                    //     <div className="text-nowrap truncate">{item.key}</div>
                    //     <div className="pl-0 sm:pl-1 text-foreground/60 truncate">{item.type}</div>
                    // </Button>
                ))}
            </div>
        </div>
    );
}
