import type { Items } from "@/types/items";
import type { GrailProgressItem } from "../api";
import tomeOfD2SetItems from "./tome-of-d2/sets.json";
import tomeOfD2UniqueItems from "./tome-of-d2/uniques.json";

type TomeOfD2GrailItem = [number, "unique" | "set", number];
export type External_TomeOfD2GrailData = { grail: TomeOfD2GrailItem[] };

const ITEM_NAME_MAP_TOME_OF_D2: Record<string, string> = {
    "Stone of Jordan": "The Stone of Jordan",
    "Tal Rasha's Fine Spun Cloth": "Tal Rasha's Fine-Spun Cloth",
};

export function getItemsToImport_TomeOfD2(
    internalProgress: Record<string, GrailProgressItem>,
    externalProgress: External_TomeOfD2GrailData,
    items: Partial<Items>
): { found: string[]; notFound: string[] } {
    const itemsToImport: { found: string[]; notFound: string[] } = {
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
            itemsToImport.found.push(key);
        } else {
            itemsToImport.notFound.push(key);
        }
    });

    return {
        found: itemsToImport.found.sort(),
        notFound: itemsToImport.notFound.sort(),
    };
}

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

const ITEM_NAME_MAP_D2_HOLY_GRAIL: Record<string, string> = {
    "Stone of Jordan": "The Stone of Jordan",
    "Tal Rasha's Fine Spun Cloth": "Tal Rasha's Fine-Spun Cloth",
};

export function getItemsToImport_D2HolyGrail(
    internalProgress: Record<string, GrailProgressItem>,
    externalProgress: External_D2HolyGrailData,
    items: Partial<Items>
): { found: string[]; notFound: string[] } {
    const allInternalItemKeys = Object.keys(items.uniqueItems ?? {})
        .concat(Object.keys(items.setItems ?? {}))
        .concat(Object.keys(items.runes ?? {}));

    const itemsToImport: { found: string[]; notFound: string[] } = {
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
            itemsToImport.found.push(key);
        } else {
            itemsToImport.notFound.push(key);
        }
    });

    return {
        found: itemsToImport.found.sort(),
        notFound: itemsToImport.notFound.sort(),
    };
}
