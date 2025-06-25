import { useQuery } from "@tanstack/react-query";
import { fetchItems, fetchRunewords, fetchUserItems, type GrailProgressItem } from "@/lib/api";
import type { Items, Runewords } from "@/types/items";

export const useItems = () => {
    return useQuery({
        queryKey: ["items"],
        queryFn: () => fetchItems() as Promise<Items>,
    });
};

export const useRunewords = () => {
    return useQuery({
        queryKey: ["runewords"],
        queryFn: () => fetchRunewords() as Promise<{ runewords: Runewords }>,
        select: data => data.runewords,
    });
};

export const useGrailProgress = () => {
    return useQuery({
        queryKey: ["grail-progress"],
        queryFn: fetchUserItems,
        select: data => {
            // Convert array to lookup map by itemKey
            return data.items.reduce(
                (acc, item) => {
                    acc[item.itemKey] = item;
                    return acc;
                },
                {} as Record<string, GrailProgressItem>
            );
        },
    });
};

/**
 * Check if an item is found in the grail
 */
export const isItemFound = (
    itemKey: string,
    grailProgress: Record<string, GrailProgressItem> | undefined
): boolean => {
    return grailProgress?.[itemKey]?.found ?? false;
};
