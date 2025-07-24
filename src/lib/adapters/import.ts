export type TomeOfD2GrailItem = [number, "unique" | "set", number];

import type { Items } from "@/types/items";
import type { GrailProgressItem } from "../api";
import tomeOfD2SetItems from "./tome-of-d2/sets.json";
import tomeOfD2UniqueItems from "./tome-of-d2/uniques.json";

const ITEM_NAME_MAP_TOME_OF_D2: Record<string, string> = {
    "Stone of Jordan": "The Stone of Jordan",
    "Tal Rasha's Fine Spun Cloth": "Tal Rasha's Fine-Spun Cloth",
};

// const TEST_EXTERNAL_TOD2_DATA = tomeOfD2SetItems
//     .map((item, i) => [i, "set", item.id])
//     .concat(tomeOfD2UniqueItems.map((item, i) => [i, "unique", item.id]));

export function getItemsToImport_TomeOfD2(
    internalProgress: Record<string, GrailProgressItem>,
    externalProgress: TomeOfD2GrailItem[],
    items: Partial<Items>
): { found: string[]; notFound: string[] } {
    const itemsToImport: { found: string[]; notFound: string[] } = {
        found: [],
        notFound: [],
    };

    const itemsToCheck = [];

    for (const tod2Item of externalProgress) {
        const type = tod2Item[1];

        if (type !== "set" && type !== "unique") {
            continue;
        }

        let itemName = (type === "unique" ? tomeOfD2UniqueItems : tomeOfD2SetItems).find(
            item => item.id === tod2Item[2]
        )?.name;

        if (!itemName) {
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
