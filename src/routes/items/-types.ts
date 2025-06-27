import type { Rune, SetItem, UniqueItem } from "@/types/items";

export type WithKey<T> = T & { key: string };

export type UniqueItemArrayItem = WithKey<UniqueItem>;
export type SetItemArrayItem = WithKey<SetItem>;
export type RuneArrayItem = WithKey<Rune>;

export type TopLevelCategory = "Armor" | "Weapons" | "Other";

export type BaseCategory =
    | "Armor"
    | "Axes"
    | "Belts"
    | "Boots"
    | "Bows"
    | "Circlets"
    | "Crossbows"
    | "Daggers"
    | "Gloves"
    | "Hammers"
    | "Helmets"
    | "Javelins"
    | "Maces"
    | "Polearms"
    | "Scepters"
    | "Shields"
    | "Spears"
    | "Staves"
    | "Swords"
    | "Throwing Weapons"
    | "Wands"
    | "Amazon Spears"
    | "Amazon Bows"
    | "Amazon Javelins"
    | "Assassin Katars"
    | "Barbarian Helmets"
    | "Druid Pelts"
    | "Necromancer Shrunken Heads"
    | "Paladin Shields"
    | "Sorceress Orbs"
    | "Amulets"
    | "Rings"
    | "Jewels"
    | "Charms";
