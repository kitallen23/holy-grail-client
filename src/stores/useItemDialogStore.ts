import type { WithKey } from "@/routes/items/-types";
import type { BaseItem, Rune, SetItem, UniqueItem } from "@/types/items";
import { create } from "zustand";

export type DialogType = "unique-item" | "set-item" | "base-item" | "rune";

interface ItemDialogState {
    item?: WithKey<UniqueItem | SetItem | BaseItem | Rune>;
    type?: DialogType;
    setItem: {
        (type: DialogType, item?: WithKey<UniqueItem | SetItem | BaseItem | Rune>): void;
        (): void;
    };
}

export const useItemDialogStore = create<ItemDialogState>(set => ({
    item: undefined,
    type: undefined,
    setItem: (type?: DialogType, item?: WithKey<UniqueItem | SetItem | BaseItem | Rune>) => {
        if (type === undefined || item === undefined) {
            set({ item: undefined, type: undefined });
        } else {
            set({ item, type });
        }
    },
}));
