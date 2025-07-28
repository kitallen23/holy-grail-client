import type { Items } from "@/types/items";
import ky from "ky";

export type QueryType = keyof Items;

export interface User {
    email: string;
}

const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL || "https://api.holy-grail.chuggs.net",
    retry: 0,
    timeout: 10000,
    credentials: "include",
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

export const fetchItems = (types?: QueryType[]) => {
    if (!types) {
        return api.get("items").json();
    }

    const params = new URLSearchParams();
    types.forEach(type => {
        params.append("types", type);
    });

    return api.get(`items?${params.toString()}`).json();
};
export const fetchRunewords = () => api.get("runewords").json();
export const fetchUserItems = () => api.get("user-items").json<UserItemsResponse>();
export const setUserItem = (itemKey: string, found: boolean) =>
    api.post("user-items/set", { json: { itemKey, found } });
export const bulkSetUserItems = (items: { itemKey: string; foundAt?: string; found: boolean }[]) =>
    api.post("user-items/set-bulk", { json: { items } });
export const clearUserItems = () => api.delete("user-items/clear").json();

export const checkAuth = () => api.get("auth/me").json<User>();
export const logout = () => api.post("auth/logout");

export { api };
