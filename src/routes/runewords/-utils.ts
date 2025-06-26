import { cleanVariablePlaceholders } from "@/lib/search";
import type { Runeword } from "@/types/items";

/**
 * Extracts all searchable text from a runeword including name, type, runes, item types, and affixes
 * @param runeword - The runeword object to extract searchable text from
 * @returns A lowercase string containing all searchable text joined with spaces
 */
export function getSearchableText(runeword: Runeword): string {
    const searchableAffixes = runeword.affixes.map(affix => cleanVariablePlaceholders(affix[0]));

    const searchableFields = [
        runeword.name,
        runeword.type,
        ...runeword.runes,
        ...runeword.itemTypes,
        ...searchableAffixes,
    ];

    return searchableFields.join(" ").toLowerCase();
}
