import type { Items, Runewords } from "@/types/items";
import { getItems, getGrailProgress, type GrailProgressItem, getRunewords } from "@/lib/api";

/**
 * Get all items (unique, set, runes)
 */
export const fetchAllItems = async (): Promise<Items> => {
    return await getItems();
};

/**
 * Get all runewords
 */
export const fetchAllRunewords = async (): Promise<{ runewords: Runewords }> => {
    return await getRunewords();
};

/**
 * Get holy grail progress and convert to lookup map
 */
export const fetchGrailProgress = async (): Promise<Record<string, GrailProgressItem>> => {
    const response = await getGrailProgress();

    // Convert array to lookup map by itemKey
    return response.items.reduce(
        (acc, item) => {
            acc[item.itemKey] = item;
            return acc;
        },
        {} as Record<string, GrailProgressItem>
    );
};

/**
 * Check if an item is found in the grail
 */
export const isItemFound = (
    itemKey: string,
    grailProgress: Record<string, GrailProgressItem>
): boolean => {
    return grailProgress[itemKey]?.found ?? false;
};
