import { cleanVariablePlaceholders } from "@/lib/search";
import type { UniqueItem, SetItem, Rune, BaseItem } from "@/types/items";

/**
 * Extracts all searchable text from an unique item, a set item, or a rune
 * @param item - The item object to extract searchable text from
 * @returns A lowercase string containing all searchable text joined with spaces
 */
export function getSearchableText(item: UniqueItem | SetItem | Rune | BaseItem): string {
    const searchableFields = [item.name];

    // Add attributes common to sets, uniques & bases
    if ("affixes" in item) {
        const parsedCategory = item.category.endsWith("Unique Armor")
            ? item.category.replace("Unique Armor", "Unique Body Armor")
            : item.category;
        searchableFields.push(parsedCategory);
        const searchableAffixes = (item.affixes || []).map(affix =>
            cleanVariablePlaceholders(affix[0])
        );
        const searchableImplicits = (item?.implicits || []).map(affix =>
            cleanVariablePlaceholders(affix[0])
        );

        searchableFields.push(...searchableImplicits, ...searchableAffixes);
    }
    if ("type" in item) {
        searchableFields.push(item.type);
    }
    // Add set-specific attributes
    if ("setBonuses" in item) {
        const searchableItemBonuses = Object.values(item.itemBonuses).map(affix =>
            cleanVariablePlaceholders(affix[0])
        );
        const searchableSetBonuses = item.setBonuses.map(affix =>
            cleanVariablePlaceholders(affix[0])
        );
        searchableFields.push(...searchableItemBonuses, ...searchableSetBonuses);
    }

    // Add rune-specific attributes
    if ("requiredLevel" in item) {
        const searchableRuneImplicits = Object.values(item.implicits);
        searchableFields.push(...searchableRuneImplicits);
    }

    return searchableFields.join(" ").toLowerCase();
}

export const ITEM_CATEGORIES = {
    Weapons: [
        "Axes",
        "Bows",
        "Crossbows",
        "Daggers",
        "Javelins",
        "Hammers",
        "Maces",
        "Polearms",
        "Scepters",
        "Spears",
        "Staves",
        "Swords",
        "Throwing Weapons",
        "Wands",
        "Amazon Bows",
        "Amazon Javelins",
        "Amazon Spears",
        "Assassin Katars",
        "Sorceress Orbs",
    ],
    Armor: [
        "Belts",
        "Armor",
        "Boots",
        "Circlets",
        "Gloves",
        "Helmets",
        "Shields",
        "Barbarian Helmets",
        "Druid Pelts",
        "Necromancer Shrunken Heads",
        "Paladin Shields",
    ],
    Other: ["Amulets", "Rings", "Jewels", "Charms"],
};
