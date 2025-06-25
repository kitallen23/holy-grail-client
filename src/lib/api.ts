import ky from "ky";
import type { Items, Runewords } from "@/types/items";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, any>();

const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL || "https://api.holy-grail.chuggs.net",
    retry: 2,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface GrailProgressItem {
    id: string;
    userId: string;
    itemKey: string;
    found: boolean;
    foundAt: string;
}

export interface UserItemsResponse {
    items: GrailProgressItem[];
}

/**
 * Fetch data with caching
 */
export const fetchWithCache = async <T>(endpoint: string): Promise<T> => {
    if (cache.has(endpoint)) {
        return cache.get(endpoint);
    }

    const data = await api.get(endpoint).json<T>();
    cache.set(endpoint, data);
    return data;
};

// API methods
export const getItems = () => fetchWithCache<Items>("items");
export const getRunewords = () => fetchWithCache<Runewords>("runewords");
export const getGrailProgress = () => fetchWithCache<UserItemsResponse>("user-items");

export { api };
