import type { UniqueItem } from "@/types/items";

export type WithKey<T> = T & { key: string };

export type UniqueItemArrayItem = WithKey<UniqueItem>;
