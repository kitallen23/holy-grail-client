import type { BaseCategory, BaseItem, Rune, SetItem, UniqueItem } from "@/types/items";

export type WithKey<T> = T & { key: string };

export type UniqueItemArrayItem = WithKey<UniqueItem>;
export type SetItemArrayItem = WithKey<SetItem>;
export type RuneArrayItem = WithKey<Rune>;
export type BaseItemArrayItem = WithKey<BaseItem>;

export type TopLevelCategory = "Armor" | "Weapons" | "Other";
export type UniqueBaseCategory = BaseCategory & ("Amulets" | "Rings" | "Jewels" | "Charms");
