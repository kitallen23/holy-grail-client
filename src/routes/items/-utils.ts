import { cleanVariablePlaceholders } from "@/lib/search";
import type { UniqueItem, SetItem, Rune } from "@/types/items";

/**
 * Extracts all searchable text from an unique item, a set item, or a rune
 * @param item - The item object to extract searchable text from
 * @returns A lowercase string containing all searchable text joined with spaces
 */
export function getSearchableText(item: UniqueItem | SetItem | Rune): string {
    const searchableFields = [];

    // Add attributes common to sets & uniques
    if ("affixes" in item) {
        const parsedCategory = item.category.endsWith("Unique Armor")
            ? item.category.replace("Unique Armor", "Unique Body Armor")
            : item.category;
        searchableFields.push(parsedCategory);
        const searchableAffixes = item.affixes.map(affix => cleanVariablePlaceholders(affix[0]));
        const searchableImplicits = (item?.implicits || []).map(affix =>
            cleanVariablePlaceholders(affix[0])
        );

        searchableFields.push(item.name, item.type, ...searchableImplicits, ...searchableAffixes);
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
