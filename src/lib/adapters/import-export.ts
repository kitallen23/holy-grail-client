import type { BaseItem, Items, UniqueCategory, UniqueItem } from "@/types/items";
import type { GrailProgressItem } from "../api";
import tomeOfD2SetItems from "./tome-of-d2/sets.json";
import tomeOfD2UniqueItems from "./tome-of-d2/uniques.json";

type Internal_GrailItem = { itemKey: string; found: boolean; foundAt?: string };
export type Internal_GrailData = Internal_GrailItem[];

type TomeOfD2GrailItem = [number, "unique" | "set", number];
export type External_TomeOfD2GrailData = { grail: TomeOfD2GrailItem[] };

type D2HolyGrailItem = { wasFound: boolean };

type D2HolyGrailArmorType = "chest" | "helm" | "circlet" | "gloves" | "belts" | "boots" | "shields";
type D2HolyGrailWeaponType =
    | "axe (1-h)"
    | "axe (2-h)"
    | "bow"
    | "crossbow"
    | "dagger"
    | "clubs (1-h)"
    | "clubs (2-h)"
    | "polearms"
    | "scepters"
    | "spears"
    | "staves"
    | "swords (1-h)"
    | "swords (2-h)"
    | "wands"
    | "throwing";

type D2HolyGrailTier = Record<"normal" | "exceptional" | "elite", Record<string, D2HolyGrailItem>>;

type D2HolyGrailUniqueCategory = {
    armor?: Record<D2HolyGrailArmorType, D2HolyGrailTier>;
    weapons?: Record<D2HolyGrailWeaponType, D2HolyGrailTier>;
    other?: {
        jewelry?: Record<"rings" | "amulets", Record<string, D2HolyGrailItem>>;
        charms?: Record<"all", Record<string, D2HolyGrailItem>>;
        "rainbow facet (jewel)": Record<"level up" | "die", Record<string, D2HolyGrailItem>>;
        classes?: Record<string, Record<string, D2HolyGrailItem>>;
    };
};

export type External_D2HolyGrailData = {
    uniques?: D2HolyGrailUniqueCategory;
    sets?: Record<string, Record<string, D2HolyGrailItem>>;
};

const ITEM_NAME_MAP_TOME_OF_D2: Record<string, string> = {
    "Stone of Jordan": "The Stone of Jordan",
    "Tal Rasha's Fine Spun Cloth": "Tal Rasha's Fine-Spun Cloth",
};

export function getItemsToImport_Backup(
    internalProgress: Record<string, GrailProgressItem>,
    externalProgress: Internal_GrailData
): { found: Internal_GrailItem[]; notFound: Internal_GrailItem[] } {
    const itemsToImport: { found: Internal_GrailItem[]; notFound: Internal_GrailItem[] } = {
        found: [],
        notFound: [],
    };

    externalProgress.forEach(({ itemKey, found, foundAt }) => {
        if (!found) {
            return;
        }
        const internalProgressItem = internalProgress[itemKey];
        if (internalProgressItem) {
            itemsToImport.found.push({ itemKey, foundAt: foundAt || undefined, found: true });
        } else {
            itemsToImport.notFound.push({ itemKey, foundAt: foundAt || undefined, found: true });
        }
    });

    return {
        found: itemsToImport.found.sort((a, b) => a.itemKey.localeCompare(b.itemKey)),
        notFound: itemsToImport.notFound.sort((a, b) => a.itemKey.localeCompare(b.itemKey)),
    };
}

export function getItemsToImport_TomeOfD2(
    internalProgress: Record<string, GrailProgressItem>,
    externalProgress: External_TomeOfD2GrailData,
    items: Partial<Items>
): { found: Internal_GrailItem[]; notFound: Internal_GrailItem[] } {
    const itemsToImport: { found: Internal_GrailItem[]; notFound: Internal_GrailItem[] } = {
        found: [],
        notFound: [],
    };

    const itemsToCheck = [];

    for (const tod2Item of externalProgress.grail) {
        const type = tod2Item[1];

        if (type !== "set" && type !== "unique") {
            continue;
        }

        let itemName = (type === "unique" ? tomeOfD2UniqueItems : tomeOfD2SetItems).find(
            item => item.id === tod2Item[2]
        )?.name;

        if (!itemName) {
            console.warn("Skipping invalid item ID: ", tod2Item[2]);
            continue;
        }

        // Perform an internal map of Tome of D2 item name --> internal item key
        if (ITEM_NAME_MAP_TOME_OF_D2[itemName]) {
            itemName = ITEM_NAME_MAP_TOME_OF_D2[itemName];
        }

        const item = items[type === "set" ? "setItems" : "uniqueItems"]![itemName];

        if (!item) {
            if (itemName.startsWith("Rainbow Facet")) {
                const facetType = itemName.split(" ")[2];
                const itemKeys = Object.keys(items.uniqueItems!).filter(key =>
                    key.startsWith(`Rainbow Facet (${facetType}`)
                );
                itemsToCheck.push(...itemKeys);
            }
        } else {
            itemsToCheck.push(itemName);
        }
    }

    itemsToCheck.forEach(key => {
        const internalProgressItem = internalProgress[key];
        if (internalProgressItem) {
            itemsToImport.found.push({ itemKey: key, found: true });
        } else {
            itemsToImport.notFound.push({ itemKey: key, found: true });
        }
    });

    return {
        found: itemsToImport.found.sort(),
        notFound: itemsToImport.notFound.sort(),
    };
}

const ITEM_NAME_MAP_D2_HOLY_GRAIL: Record<string, string> = {
    "Stone of Jordan": "The Stone of Jordan",
    "Tal Rasha's Fine Spun Cloth": "Tal Rasha's Fine-Spun Cloth",
};

export function getItemsToImport_D2HolyGrail(
    internalProgress: Record<string, GrailProgressItem>,
    externalProgress: External_D2HolyGrailData,
    items: Partial<Items>
): { found: Internal_GrailItem[]; notFound: Internal_GrailItem[] } {
    const allInternalItemKeys = Object.keys(items.uniqueItems ?? {})
        .concat(Object.keys(items.setItems ?? {}))
        .concat(Object.keys(items.runes ?? {}));

    const itemsToImport: { found: Internal_GrailItem[]; notFound: Internal_GrailItem[] } = {
        found: [],
        notFound: [],
    };

    const itemsToCheck: string[] = [];

    // Process unique armor
    Object.values(externalProgress.uniques?.armor ?? {}).forEach(tier => {
        Object.values(tier).forEach(tierItems => {
            Object.entries(tierItems).forEach(([key, item]) => {
                const itemName = ITEM_NAME_MAP_D2_HOLY_GRAIL[key] || key;

                if (item.wasFound) {
                    itemsToCheck.push(itemName);
                }
            });
        });
    });
    // Process unique weapons
    Object.values(externalProgress.uniques?.weapons ?? {}).forEach(tier => {
        Object.values(tier).forEach(tierItems => {
            Object.entries(tierItems).forEach(([key, item]) => {
                const itemName = ITEM_NAME_MAP_D2_HOLY_GRAIL[key] || key;

                if (item.wasFound) {
                    itemsToCheck.push(itemName);
                }
            });
        });
    });
    // Process other uniques
    Object.entries(externalProgress.uniques?.other ?? {}).forEach(([type, typeData]) => {
        if (type === "rainbow facet (jewel)") {
            Object.entries(
                (typeData as Record<"level up" | "die", Record<string, D2HolyGrailItem>>)?.[
                    "level up"
                ] ?? {}
            ).forEach(([key, item]) => {
                const element = key === "Light" ? "Lightning" : key;
                const itemName = `Rainbow Facet (${element} Level)`;

                if (item.wasFound) {
                    itemsToCheck.push(itemName);
                }
            });
            Object.entries(
                (typeData as Record<"level up" | "die", Record<string, D2HolyGrailItem>>)?.die ?? {}
            ).forEach(([key, item]) => {
                const element = key === "Light" ? "Lightning" : key;
                const itemName = `Rainbow Facet (${element} Die)`;

                if (item.wasFound) {
                    itemsToCheck.push(itemName);
                }
            });
        } else {
            Object.values(typeData).forEach(subtype => {
                Object.entries(subtype).forEach(([key, item]) => {
                    const itemName = ITEM_NAME_MAP_D2_HOLY_GRAIL[key] || key;

                    if (item.wasFound) {
                        itemsToCheck.push(itemName);
                    }
                });
            });
        }
    });
    // Process set items
    Object.values(externalProgress.sets ?? {}).forEach(set => {
        Object.entries(set).forEach(([key, item]) => {
            const itemName = ITEM_NAME_MAP_D2_HOLY_GRAIL[key] || key;

            if (item.wasFound) {
                itemsToCheck.push(itemName);
            }
        });
    });

    itemsToCheck.forEach(key => {
        const itemExists = !!allInternalItemKeys.some(itemKey => itemKey === key);
        if (!itemExists) {
            console.warn("Skipping invalid item key: ", key);
            return;
        }

        const internalProgressItem = internalProgress[key];
        if (internalProgressItem) {
            itemsToImport.found.push({ itemKey: key, found: true });
        } else {
            itemsToImport.notFound.push({ itemKey: key, found: true });
        }
    });

    return {
        found: itemsToImport.found.sort(),
        notFound: itemsToImport.notFound.sort(),
    };
}

export function prepareExportData_Backup(grailProgress: Record<string, GrailProgressItem>): {
    count: number;
    data: Internal_GrailData;
} {
    const exportData: Internal_GrailData = [];

    Object.entries(grailProgress).forEach(([key, itemData]) => {
        if (!itemData.found) {
            return;
        }

        exportData.push({
            itemKey: key,
            found: true,
            foundAt: itemData.foundAt || "",
        });
    });

    return { count: exportData.length, data: exportData };
}

export function prepareExportData_TomeOfD2(
    grailProgress: Record<string, GrailProgressItem>,
    items: Items
): { count: number; data: External_TomeOfD2GrailData } {
    let incrementingId = 1;
    const exportData: External_TomeOfD2GrailData = { grail: [] };

    const facets = new Set<string>();

    Object.entries(grailProgress).forEach(([key, itemData]) => {
        if (!itemData.found) {
            return;
        }

        if (items.setItems[key]) {
            const tod2Key =
                Object.entries(ITEM_NAME_MAP_TOME_OF_D2).find(([, k2]) => k2 === key)?.[0] || key;

            // Set item ID found so add it to the export data
            const tod2Item = tomeOfD2SetItems.find(item => item.name === tod2Key);
            if (tod2Item) {
                exportData.grail.push([incrementingId++, "set", tod2Item.id]);
            }
        } else if (items.uniqueItems[key]) {
            const tod2Key =
                Object.entries(ITEM_NAME_MAP_TOME_OF_D2).find(([, k2]) => k2 === key)?.[0] || key;

            // Special logic to store the key of the facet to deal with later
            if (tod2Key.startsWith("Rainbow Facet")) {
                const match = tod2Key.match(/\((\w+)/);
                const result = `Rainbow Facet ${match![1]}`;

                facets.add(result);
            }

            // Unique item ID found so add it to the export data
            const tod2Item = tomeOfD2UniqueItems.find(item => item.name === tod2Key);
            if (tod2Item) {
                exportData.grail.push([incrementingId++, "unique", tod2Item.id]);
            }
        }
    });

    // Add facets separately; ToD2 doesn't track different facets for die vs lvl
    facets.forEach(key => {
        const tod2Item = tomeOfD2UniqueItems.find(item => item.name === key);
        if (tod2Item) {
            exportData.grail.push([incrementingId++, "unique", tod2Item.id]);
        }
    });

    return { count: exportData?.grail.length || 0, data: exportData };
}

function getReverseMapping(map: Record<string, string>): Record<string, string> {
    return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
}

export function prepareExportData_D2HolyGrail(
    grailProgress: Record<string, GrailProgressItem>,
    items: Items
): {
    count: number;
    data: External_D2HolyGrailData;
} {
    const data: External_D2HolyGrailData = {
        uniques: {
            armor: {} as Record<D2HolyGrailArmorType, D2HolyGrailTier>,
            weapons: {} as Record<D2HolyGrailWeaponType, D2HolyGrailTier>,
            other: {
                jewelry: { rings: {}, amulets: {} },
                charms: { all: {} },
                "rainbow facet (jewel)": { "level up": {}, die: {} },
                classes: {},
            },
        },
        sets: {},
    };
    let count = 0;
    const internalToExternalMap = getReverseMapping(ITEM_NAME_MAP_D2_HOLY_GRAIL);

    // Process unique items
    for (const [itemKey, item] of Object.entries(items.uniqueItems)) {
        const externalKey = internalToExternalMap[itemKey] || itemKey;
        const progress = grailProgress[itemKey];

        const grailItem = { wasFound: progress?.found ?? false };

        if (grailItem.wasFound) {
            count++;
        }

        if (item.category.includes("Amulets")) {
            data.uniques!.other!.jewelry!.amulets[externalKey] = grailItem;
        } else if (item.category.includes("Rings")) {
            data.uniques!.other!.jewelry!.rings[externalKey] = grailItem;
        } else if (item.category.includes("Charms")) {
            data.uniques!.other!.charms!.all[externalKey] = grailItem;
        } else if (item.category.includes("Jewels")) {
            // Rainbow facets
            const facetType = externalKey.includes("Level") ? "level up" : "die";
            const match = externalKey.match(/\((\w+)/) || ["", ""];
            if (match) {
                const element = match[1] === "Lightning" ? "Light" : match[1];
                data.uniques!.other!["rainbow facet (jewel)"][facetType][element] = grailItem;
            }
        } else if (isClassSpecificItem(item.category)) {
            const className = getClassFromCategory(item.category).toLowerCase();
            if (!data.uniques!.other!.classes![className]) {
                data.uniques!.other!.classes![className] = {};
            }
            data.uniques!.other!.classes![className][externalKey] = grailItem;
        } else if (isArmorCategory(item.category)) {
            const armorType = getArmorType(item.category);
            const tier = getTier(item.category);

            if (!data.uniques!.armor![armorType]) {
                data.uniques!.armor![armorType] = { normal: {}, exceptional: {}, elite: {} };
            }
            data.uniques!.armor![armorType][tier][externalKey] = grailItem;
        } else if (isWeaponCategory(item.category)) {
            const weaponType = getWeaponType(item, items.baseItems);
            const tier = getTier(item.category);

            if (!data.uniques!.weapons![weaponType]) {
                data.uniques!.weapons![weaponType] = { normal: {}, exceptional: {}, elite: {} };
            }
            data.uniques!.weapons![weaponType][tier][externalKey] = grailItem;
        }
    }

    // Process set items
    for (const [itemKey, item] of Object.entries(items.setItems)) {
        const externalKey = internalToExternalMap[itemKey] || itemKey;
        const progress = grailProgress[itemKey];
        const grailItem = { wasFound: progress?.found ?? false };

        if (grailItem.wasFound) {
            count++;
        }

        if (!data.sets![item.category]) {
            data.sets![item.category] = {};
        }
        data.sets![item.category][externalKey] = grailItem;
    }

    return { count, data };
}

function isClassSpecificItem(category: UniqueCategory): boolean {
    return (
        category.includes("Amazon") ||
        category.includes("Assassin") ||
        category.includes("Barbarian") ||
        category.includes("Druid") ||
        category.includes("Necromancer") ||
        category.includes("Paladin") ||
        category.includes("Sorceress")
    );
}

function getClassFromCategory(category: UniqueCategory): string {
    if (category.includes("Amazon")) return "Amazon";
    if (category.includes("Assassin")) return "Assassin";
    if (category.includes("Barbarian")) return "Barbarian";
    if (category.includes("Druid")) return "Druid";
    if (category.includes("Necromancer")) return "Necromancer";
    if (category.includes("Paladin")) return "Paladin";
    if (category.includes("Sorceress")) return "Sorceress";
    return "Unknown";
}

function isArmorCategory(category: UniqueCategory): boolean {
    return (
        category.includes("Armor") ||
        category.includes("Belts") ||
        category.includes("Boots") ||
        category.includes("Gloves") ||
        category.includes("Helmets") ||
        category.includes("Circlets") ||
        category.includes("Shields")
    );
}

function getArmorType(category: UniqueCategory): D2HolyGrailArmorType {
    if (category.includes("Armor")) return "chest";
    if (category.includes("Helmets")) return "helm";
    if (category.includes("Circlets")) return "circlet";
    if (category.includes("Gloves")) return "gloves";
    if (category.includes("Belts")) return "belts";
    if (category.includes("Boots")) return "boots";
    if (category.includes("Shields")) return "shields";
    throw new Error(`Unknown armor category: ${category}`);
}

function isWeaponCategory(category: UniqueCategory): boolean {
    return (
        category.includes("Axes") ||
        category.includes("Bows") ||
        category.includes("Crossbows") ||
        category.includes("Daggers") ||
        category.includes("Hammers") ||
        category.includes("Maces") ||
        category.includes("Polearms") ||
        category.includes("Scepters") ||
        category.includes("Spears") ||
        category.includes("Staves") ||
        category.includes("Swords") ||
        category.includes("Throwing") ||
        category.includes("Wands") ||
        category.includes("Javelins")
    );
}

function getWeaponType(
    item: UniqueItem,
    baseItems: Record<string, BaseItem>
): D2HolyGrailWeaponType {
    const category = item.category;

    if (category.includes("Axes")) {
        return isOneHanded(item.type, baseItems) ? "axe (1-h)" : "axe (2-h)";
    }
    if (category.includes("Bows")) return "bow";
    if (category.includes("Crossbows")) return "crossbow";
    if (category.includes("Daggers")) return "dagger";
    if (category.includes("Hammers") || category.includes("Maces")) {
        return isOneHanded(item.type, baseItems) ? "clubs (1-h)" : "clubs (2-h)";
    }
    if (category.includes("Polearms")) return "polearms";
    if (category.includes("Scepters")) return "scepters";
    if (category.includes("Spears")) return "spears";
    if (category.includes("Staves")) return "staves";
    if (category.includes("Swords")) {
        return isOneHanded(item.type, baseItems) ? "swords (1-h)" : "swords (2-h)";
    }
    if (category.includes("Wands")) return "wands";
    if (category.includes("Throwing") || category.includes("Javelins")) return "throwing";

    throw new Error(`Unknown weapon category: ${category}`);
}

function isOneHanded(itemType: string, baseItems: Record<string, BaseItem>): boolean {
    const baseItem = baseItems[itemType];
    if (!baseItem) return true; // Default to 1h if base not found

    const implicits = baseItem.implicits || [];
    const hasOneHand = implicits.some(implicit => implicit[0].includes("One-Hand Damage"));
    const hasTwoHand = implicits.some(implicit => implicit[0].includes("Two-Hand Damage"));

    // If has both, it's 2-handed. If only one-hand, it's 1-handed. If only two-hand, it's 2-handed.
    return hasOneHand && !hasTwoHand;
}

function getTier(category: UniqueCategory): "normal" | "exceptional" | "elite" {
    if (category.includes("Exceptional")) return "exceptional";
    if (category.includes("Elite")) return "elite";
    return "normal";
}
