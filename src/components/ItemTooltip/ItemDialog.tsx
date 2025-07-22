import { useItemDialogStore } from "@/stores/useItemDialogStore";
import UniqueItemDialog from "./UniqueItemDialog";
import { useItems } from "@/hooks/queries";
import { useRef } from "react";
import type { BaseItem, UniqueItem } from "@/types/items";
import BaseItemDialog from "./BaseItemDialog";
import type { DialogContent } from "@/components/ui/dialog";

const ItemDialog = () => {
    const { item, type, setItem, onClose } = useItemDialogStore();
    const { data, isFetching } = useItems(["baseItems"]);
    const baseItems = data?.baseItems;

    const baseDialogRef = useRef<React.ComponentRef<typeof DialogContent>>(null);

    const handleBaseItemClick = (itemName: string) => {
        const [key, baseItem] =
            Object.entries(baseItems || {}).find(([, item]) => item.name === itemName) || [];
        if (key && baseItem) {
            setItem("base-item", { ...baseItem, key });
        }
        baseDialogRef.current?.scrollTo(0, 0);
    };

    if (isFetching) {
        return null;
    }

    return (
        <>
            <UniqueItemDialog
                open={(item && type === "unique-item") ?? false}
                onOpenChange={onClose}
                item={type === "unique-item" ? (item as UniqueItem) : undefined}
                onBaseItemClick={handleBaseItemClick}
            />
            <BaseItemDialog
                ref={baseDialogRef}
                open={(item && type === "base-item") ?? false}
                onOpenChange={onClose}
                item={type === "base-item" ? (item as BaseItem) : undefined}
                onBaseItemClick={handleBaseItemClick}
            />
        </>
    );
};

export default ItemDialog;
