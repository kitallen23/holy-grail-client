import type { Rune, SetItem, UniqueItem } from "@/types/items";

export type WithKey<T> = T & { key: string };

export type UniqueItemArrayItem = WithKey<UniqueItem>;
export type SetItemArrayItem = WithKey<SetItem>;
export type RuneArrayItem = WithKey<Rune>;

export type TopLevelCategory = "Armor" | "Weapons" | "Other";
