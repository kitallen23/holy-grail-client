import ky from "ky";

const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL || "https://api.holy-grail.chuggs.net",
    retry: 0,
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

export const fetchItems = () => api.get("items").json();
export const fetchRunewords = () => api.get("runewords").json();
export const fetchUserItems = () => api.get("user-items").json<UserItemsResponse>();

export { api };
