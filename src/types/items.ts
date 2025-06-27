/**
 * All types in this file are identical on client / server
 */
type UniqueCategory =
    | "Unique Armor"
    | "Exceptional Unique Armor"
    | "Elite Unique Armor"
    | "Unique Axes"
    | "Exceptional Unique Axes"
    | "Elite Unique Axes"
    | "Unique Belts"
    | "Exceptional Unique Belts"
    | "Elite Unique Belts"
    | "Unique Boots"
    | "Exceptional Unique Boots"
    | "Elite Unique Boots"
    | "Unique Bows"
    | "Exceptional Unique Bows"
    | "Elite Unique Bows"
    | "Unique Crossbows"
    | "Exceptional Unique Crossbows"
    | "Elite Unique Crossbows"
    | "Unique Daggers"
    | "Exceptional Unique Daggers"
    | "Elite Unique Daggers"
    | "Unique Gloves"
    | "Exceptional Unique Gloves"
    | "Elite Unique Gloves"
    | "Unique Helmets"
    | "Exceptional Unique Helmets"
    | "Elite Unique Helmets"
    | "Elite Unique Circlets"
    | "Elite Unique Javelins"
    | "Unique Amulets"
    | "Unique Rings"
    | "Unique Hammers"
    | "Exceptional Unique Hammers"
    | "Elite Unique Hammers"
    | "Unique Maces"
    | "Exceptional Unique Maces"
    | "Elite Unique Maces"
    | "Unique Polearms"
    | "Exceptional Unique Polearms"
    | "Elite Unique Polearms"
    | "Unique Scepters"
    | "Exceptional Unique Scepters"
    | "Elite Unique Scepters"
    | "Unique Shields"
    | "Exceptional Unique Shields"
    | "Elite Unique Shields"
    | "Unique Spears"
    | "Exceptional Unique Spears"
    | "Elite Unique Spears"
    | "Unique Staves"
    | "Exceptional Unique Staves"
    | "Elite Unique Staves"
    | "Unique Swords"
    | "Exceptional Unique Swords"
    | "Elite Unique Swords"
    | "Exceptional Unique Throwing Weapons"
    | "Elite Unique Throwing Weapons"
    | "Unique Wands"
    | "Exceptional Unique Wands"
    | "Elite Unique Wands"
    | "Exceptional Unique Amazon Spears"
    | "Elite Unique Amazon Spears"
    | "Exceptional Unique Amazon Bows"
    | "Elite Unique Amazon Bows"
    | "Exceptional Unique Amazon Javelins"
    | "Elite Unique Amazon Javelins"
    | "Exceptional Unique Assassin Katars"
    | "Elite Unique Assassin Katars"
    | "Exceptional Unique Barbarian Helmets"
    | "Elite Unique Barbarian Helmets"
    | "Exceptional Unique Druid Pelts"
    | "Elite Unique Druid Pelts"
    | "Exceptional Unique Necromancer Shrunken Heads"
    | "Elite Unique Necromancer Shrunken Heads"
    | "Exceptional Unique Paladin Shields"
    | "Elite Unique Paladin Shields"
    | "Exceptional Unique Sorceress Orbs"
    | "Elite Unique Sorceress Orbs"
    | "Unique Charms"
    | "Unique Jewels";

export type SetCategory =
    | "Angelic Raiment"
    | "Arcanna's Tricks"
    | "Arctic Gear"
    | "Berserker's Arsenal"
    | "Cathan's Traps"
    | "Civerb's Vestments"
    | "Cleglaw's Brace"
    | "Death's Disguise"
    | "Hsarus' Defense"
    | "Infernal Tools"
    | "Iratha's Finery"
    | "Isenhart's Armory"
    | "Milabrega's Regalia"
    | "Sigon's Complete Steel"
    | "Tancred's Battlegear"
    | "Vidala's Rig"
    | "Cow King's Leathers"
    | "Heaven's Brethren"
    | "Hwanin's Majesty"
    | "Naj's Ancient Vestige"
    | "Orphan's Call"
    | "Sander's Folly"
    | "Sazabi's Grand Tribute"
    | "The Disciple"
    | "Aldur's Watchtower"
    | "Bul-Kathos' Children"
    | "Griswold's Legacy"
    | "Immortal King"
    | "M'avina's Battle Hymn"
    | "Natalya's Odium"
    | "Tal Rasha's Wrappings"
    | "Trang-Oul's Avatar";

type RuneItemType = "Weapons" | "Armor" | "Helms" | "Shields";
type RuneName =
    | "El"
    | "Eld"
    | "Tir"
    | "Nef"
    | "Eth"
    | "Ith"
    | "Tal"
    | "Ral"
    | "Ort"
    | "Thul"
    | "Amn"
    | "Sol"
    | "Shael"
    | "Dol"
    | "Hel"
    | "Io"
    | "Lum"
    | "Ko"
    | "Fal"
    | "Lem"
    | "Pul"
    | "Um"
    | "Mal"
    | "Ist"
    | "Gul"
    | "Vex"
    | "Ohm"
    | "Lo"
    | "Sur"
    | "Ber"
    | "Jah"
    | "Cham"
    | "Zod";

export type RunewordBaseType = "Weapons" | "Body Armor" | "Shields" | "Helmets";

export type Tier = "Normal" | "Exceptional" | "Elite";

// Main string, ...variables
export type ItemProp = [string, ...string[]];

interface BaseItem {
    name: string;
    implicits?: ItemProp[];
    affixes: ItemProp[];
}

export interface UniqueItem extends BaseItem {
    type: string;
    image: string;
    category: UniqueCategory;
}

export interface SetItem extends BaseItem {
    type: string;
    image: string;
    category: SetCategory;
    itemBonuses: Record<number | string, ItemProp>;
    setBonuses: ItemProp[];
    setItems: string[];
}

export interface Runeword extends BaseItem {
    runes: RuneName[];
    type: RunewordBaseType;
    itemTypes: string[];
    sockets: number;
}

export interface Rune {
    name: RuneName;
    requiredLevel: number;
    implicits: Record<RuneItemType, string>;
}

export type Items = {
    uniqueItems: Record<string, UniqueItem>;
    setItems: Record<string, SetItem>;
    runes: Record<string, Rune>;
};

export type Runewords = Record<string, Runeword>;
