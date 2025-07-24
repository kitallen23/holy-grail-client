import { setUserItem, type GrailProgressItem } from "@/lib/api";
import { API_CALL_DEBOUNCE_DELAY } from "@/lib/constants";
import { createWithEqualityFn as create } from "zustand/traditional";

// Cache updates
const pendingUpdates = new Map<string, NodeJS.Timeout>();

interface GrailProgressStore {
    items?: Record<string, GrailProgressItem>;
    setFound: (key: string, value: boolean) => void;
    setItems: (value?: Record<string, GrailProgressItem>) => void;
}

export const useGrailProgressStore = create<GrailProgressStore>(set => ({
    items: undefined,

    setFound: (itemKey, found) => {
        // Clear existing timeout for this item
        const existingUpdate = pendingUpdates.get(itemKey);
        if (existingUpdate) {
            clearTimeout(existingUpdate);
        }

        set(state => {
            if (!found) {
                // Remove item from state when found is false
                const newItems = { ...state.items };
                delete newItems[itemKey];
                return { items: newItems };
            }

            const existingItem = state.items?.[itemKey];
            const now = new Date().toISOString();

            return {
                items: {
                    ...state.items,
                    [itemKey]: existingItem
                        ? { ...existingItem, found, foundAt: now }
                        : {
                              id: crypto.randomUUID(),
                              userId: "",
                              itemKey,
                              found,
                              foundAt: now,
                          },
                },
            };
        });

        // Debounced API call
        const timeout = setTimeout(() => {
            setUserItem(itemKey, found);
            pendingUpdates.delete(itemKey);
        }, API_CALL_DEBOUNCE_DELAY);

        pendingUpdates.set(itemKey, timeout);
    },

    setItems: items => set({ items }),
}));
