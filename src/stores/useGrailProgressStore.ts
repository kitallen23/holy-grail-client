import type { GrailProgressItem } from "@/lib/api";
import { createWithEqualityFn as create } from "zustand/traditional";

interface GrailProgressStore {
    items: Record<string, GrailProgressItem>;
    setFound: (key: string, value: boolean) => void;
    setItems: (value: Record<string, GrailProgressItem>) => void;
}

export const useGrailProgressStore = create<GrailProgressStore>(set => ({
    items: {},

    setFound: (itemKey, found) =>
        set(state => {
            const existing = state.items[itemKey];
            const now = new Date().toISOString();

            return {
                items: {
                    ...state.items,
                    [itemKey]: existing
                        ? { ...existing, found, foundAt: found ? now : "" }
                        : {
                              id: crypto.randomUUID(),
                              userId: "",
                              itemKey,
                              found,
                              foundAt: found ? now : "",
                          },
                },
            };
        }),

    setItems: items => set({ items }),
}));

// TODO: Remove me
useGrailProgressStore.subscribe(state => {
    console.info("Grail items changed:", state.items);
});
