import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
    fetchItems,
    fetchRunewords,
    fetchUserItems,
    type GrailProgressItem,
    type QueryType,
} from "@/lib/api";
import type { Items, Runewords } from "@/types/items";

type UseItemsOptions = Omit<
    UseQueryOptions<{ items: Partial<Items> }, Error, Partial<Items>>,
    "queryKey" | "queryFn" | "select"
>;

export const useItems = (types: QueryType[], options?: UseItemsOptions) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["items", types.sort()],
        queryFn: async () => {
            // Check what's already cached
            const missingTypes = types.filter(type => {
                const cached = queryClient.getQueryData(["items", "single", type]);
                return !cached;
            });

            let response: { items: Partial<Items> } = { items: {} };

            // Fetch missing types
            if (missingTypes.length > 0) {
                response = (await fetchItems(missingTypes)) as { items: Partial<Items> };

                // Cache individual types
                missingTypes.forEach(type => {
                    if (response.items[type]) {
                        queryClient.setQueryData(["items", "single", type], {
                            items: response.items[type],
                        });
                    }
                });
            }

            // Combine cached + fetched data
            const combinedItems: Partial<Items> = {};
            types.forEach(type => {
                const cached = queryClient.getQueryData(["items", "single", type]) as
                    | { items: Items[typeof type] }
                    | undefined;
                if (cached?.items) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (combinedItems as any)[type] = cached.items;
                }
            });

            return { items: combinedItems };
        },
        select: data => data.items,
        ...options,
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
