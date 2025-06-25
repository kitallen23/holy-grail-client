import type { Runeword } from "@/types/items";

/**
 * Removes variable placeholders ({{1}}, {{2}}, etc.) from text
 * @param text - The text to clean
 * @returns Text with variable placeholders removed
 */
function cleanVariablePlaceholders(text: string): string {
    return text.replace(/\{\{\d+\}\}/g, "").trim();
}

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

/**
 * Splits a search string into valid search terms, filtering out terms shorter than 2 characters
 * @param searchString - The raw search input from the user
 * @returns An array of lowercase search terms with length >= 2
 */
export function getSearchTerms(searchString: string): string[] {
    return searchString
        .toLowerCase()
        .split(/\s+/)
        .filter(term => term.length >= 2);
}

/**
 * Checks if all search terms are found within the searchable text
 * @param searchableText - The preprocessed searchable text from a runeword
 * @param searchTerms - Array of search terms to match
 * @returns True if all search terms are found in the searchable text
 */
export function matchesAllTerms(searchableText: string, searchTerms: string[]): boolean {
    return searchTerms.every(term => searchableText.includes(term));
}
