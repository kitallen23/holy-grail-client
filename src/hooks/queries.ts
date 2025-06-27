import { useQuery } from "@tanstack/react-query";
import {
    fetchItems,
    fetchRunewords,
    fetchUserItems,
    type GrailProgressItem,
    type QueryItem,
} from "@/lib/api";
import type { Items, Rune, Runewords, SetItem, UniqueItem } from "@/types/items";

export const useItems = (type?: QueryItem) => {
    return useQuery({
        queryKey: type ? ["items", type] : ["items"],
        queryFn: () =>
            fetchItems(type) as Promise<{
                items: Items | Record<string, UniqueItem | SetItem | Rune>;
            }>,
        select: data => data.items,
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
