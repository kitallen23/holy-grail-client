import { useItemDialogStore } from "@/stores/useItemDialogStore";
import UniqueItemDialog from "./UniqueItemDialog";
import { useItems } from "@/hooks/queries";
import { useRef } from "react";
import type { BaseItem, SetItem, UniqueItem } from "@/types/items";
import BaseItemDialog from "./BaseItemDialog";
import type { DialogContent } from "@/components/ui/dialog";
import SetItemDialog from "./SetItemDialog";

const ItemDialog = () => {
    const { item, type, setItem, onClose } = useItemDialogStore();
    const { data, isFetching } = useItems(["baseItems", "setItems"], {
        enabled: !!item,
    });
    const baseItems = data?.baseItems;
    const setItems = data?.setItems;

    const baseDialogRef = useRef<React.ComponentRef<typeof DialogContent>>(null);
    const setDialogRef = useRef<React.ComponentRef<typeof DialogContent>>(null);

    const handleBaseItemClick = (itemName: string) => {
        const [key, item] =
            Object.entries(baseItems || {}).find(([, item]) => item.name === itemName) || [];
        if (key && item) {
            setItem("base-item", { ...item, key });
        }
        baseDialogRef.current?.scrollTo(0, 0);
    };
    const handleSetItemClick = (itemName: string) => {
        const [key, item] =
            Object.entries(setItems || {}).find(([, item]) => item.name === itemName) || [];
        if (key && item) {
            setItem("set-item", { ...item, key });
        }
        setDialogRef.current?.scrollTo(0, 0);
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
            <SetItemDialog
                ref={setDialogRef}
                open={(item && type === "set-item") ?? false}
                onOpenChange={onClose}
                item={type === "set-item" ? (item as SetItem) : undefined}
                onSetItemClick={handleSetItemClick}
                onBaseItemClick={handleBaseItemClick}
            />
        </>
    );
};

export default ItemDialog;
