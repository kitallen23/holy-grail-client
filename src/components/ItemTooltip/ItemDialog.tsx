import { useItemDialogStore } from "@/stores/useItemDialogStore";
import UniqueItemDialog from "./UniqueItemDialog";
import { useItems } from "@/hooks/queries";
import { useRef } from "react";
import type { BaseItem, Rune, SetItem, UniqueItem } from "@/types/items";
import BaseItemDialog from "./BaseItemDialog";
import type { DialogContent } from "@/components/ui/dialog";
import SetItemDialog from "./SetItemDialog";
import RuneDialog from "./RuneDialog";
import type { WithKey } from "@/routes/items/-types";

const ItemDialog = () => {
    const { item, type, setItem } = useItemDialogStore();
    // Lazy load base items
    const { data: baseData } = useItems(["baseItems"], {
        enabled: !!item,
    });
    // Lazy load set items (only if a set item is viewed)
    const { data: setData } = useItems(["setItems"], {
        enabled: !!item && type === "set-item",
    });
    const baseItems = baseData?.baseItems;
    const setItems = setData?.setItems;

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

    return (
        <>
            <UniqueItemDialog
                open={(item && type === "unique-item") ?? false}
                onOpenChange={() => setItem()}
                item={type === "unique-item" ? (item as WithKey<UniqueItem>) : undefined}
                onBaseItemClick={handleBaseItemClick}
            />
            <BaseItemDialog
                ref={baseDialogRef}
                open={(item && type === "base-item") ?? false}
                onOpenChange={() => setItem()}
                item={type === "base-item" ? (item as WithKey<BaseItem>) : undefined}
                onBaseItemClick={handleBaseItemClick}
            />
            <SetItemDialog
                ref={setDialogRef}
                open={(item && type === "set-item") ?? false}
                onOpenChange={() => setItem()}
                item={type === "set-item" ? (item as WithKey<SetItem>) : undefined}
                onSetItemClick={handleSetItemClick}
                onBaseItemClick={handleBaseItemClick}
            />
            <RuneDialog
                open={(item && type === "rune") ?? false}
                onOpenChange={() => setItem()}
                rune={type === "rune" ? (item as WithKey<Rune>) : undefined}
            />
        </>
    );
};

export default ItemDialog;
