import type { BaseItem, Rune, SetItem, UniqueItem } from "@/types/items";
import type { RowData } from "./-types";
import type { GrailProgressItem } from "@/lib/api";
import type { WithKey } from "@/routes/items/-types";
import { ITEM_CATEGORIES } from "@/routes/items/-utils";

export type UniqueBase = {
    base: Partial<WithKey<BaseItem>>;
    foundUniqueItems: WithKey<UniqueItem>[];
    notFoundUniqueItems: WithKey<UniqueItem>[];
    hide: boolean;
};

export type SetBase = {
    base: Partial<WithKey<BaseItem>>;
    foundSetItems: WithKey<SetItem>[];
    notFoundSetItems: WithKey<SetItem>[];
    hide: boolean;
};

export const buildTableRows = (
    uniqueItems: Record<string, UniqueItem>,
    setItems: Record<string, SetItem>,
    runes: Record<string, Rune>,
    grailProgress: Record<string, GrailProgressItem>
): RowData[] => {
    if (!uniqueItems || !setItems || !runes) {
        return [];
    }

    const foundItemKeys = Object.values(grailProgress).map(item => item.itemKey);

    const uniqueWeapons = Object.entries(uniqueItems)
        .map(([key, item]) => ({ ...item, key }))
        .filter((item: WithKey<UniqueItem>) =>
            ITEM_CATEGORIES.Weapons.some(category => item.category.endsWith(`Unique ${category}`))
        );
    const uniqueArmor = Object.entries(uniqueItems)
        .map(([key, item]) => ({ ...item, key }))
        .filter((item: WithKey<UniqueItem>) =>
            ITEM_CATEGORIES.Armor.some(category => item.category.endsWith(`Unique ${category}`))
        );
    const uniqueOther = Object.entries(uniqueItems)
        .map(([key, item]) => ({ ...item, key }))
        .filter((item: WithKey<UniqueItem>) =>
            ITEM_CATEGORIES.Other.some(category => item.category.endsWith(`Unique ${category}`))
        );

    const setItemsArray = Object.entries(setItems).map(([key, item]) => ({ ...item, key }));
    const runesArray = Object.entries(runes).map(([key, item]) => ({ ...item, key }));

    const data = [];

    // Build table data for unique weapons
    const foundUniqueWeaponCount = uniqueWeapons.filter(item =>
        foundItemKeys.includes(item.key)
    ).length;
    const foundUniqueWeaponPercentage = Math.floor(
        (foundUniqueWeaponCount / uniqueWeapons.length) * 100
    );
    data.push({
        title: "Unique Weapons",
        total: uniqueWeapons.length,
        found: foundUniqueWeaponCount,
        percentage: foundUniqueWeaponPercentage,
    });

    // Build table data for unique armor
    const foundUniqueArmorCount = uniqueArmor.filter(item =>
        foundItemKeys.includes(item.key)
    ).length;
    const foundUniqueArmorPercentage = Math.floor(
        (foundUniqueArmorCount / uniqueArmor.length) * 100
    );
    data.push({
        title: "Unique Armor",
        total: uniqueArmor.length,
        found: foundUniqueArmorCount,
        percentage: foundUniqueArmorPercentage,
    });

    // Build table data for other uniques
    const foundUniqueOtherCount = uniqueOther.filter(item =>
        foundItemKeys.includes(item.key)
    ).length;
    const foundUniqueOtherPercentage = Math.floor(
        (foundUniqueOtherCount / uniqueOther.length) * 100
    );
    data.push({
        title: "Unique Other",
        total: uniqueOther.length,
        found: foundUniqueOtherCount,
        percentage: foundUniqueOtherPercentage,
    });

    // Build table data for set items
    const foundSetItemCount = setItemsArray.filter(item => foundItemKeys.includes(item.key)).length;
    const foundSetItemPercentage = Math.floor((foundSetItemCount / setItemsArray.length) * 100);
    data.push({
        title: "Set Items",
        total: setItemsArray.length,
        found: foundSetItemCount,
        percentage: foundSetItemPercentage,
    });

    // Build table data for runes
    const foundRunesCount = runesArray.filter(item => foundItemKeys.includes(item.key)).length;
    const foundRunesPercentage = Math.floor((foundRunesCount / runesArray.length) * 100);
    data.push({
        title: "Runes",
        total: runesArray.length,
        found: foundRunesCount,
        percentage: foundRunesPercentage,
    });

    return data;
};

export const getRemainingUniqueBases = (
    uniqueItems: Record<string, UniqueItem>,
    baseItems: Record<string, BaseItem>,
    grailProgress: Record<string, GrailProgressItem>,
    selectedFilters: Record<string, boolean>
): Record<string, UniqueBase> => {
    const foundItemKeys = Object.values(grailProgress)
        .filter(item => !!item.found)
        .map(item => item.itemKey);

    const uniqueBases: Record<string, UniqueBase> = {};
    const hasActiveFilter = Object.values(selectedFilters).some(val => val);

    Object.entries(uniqueItems).forEach(([key, item]) => {
        const itemWithKey = { ...item, key };
        const isItemFound = foundItemKeys.includes(key);

        const itemType = Object.entries(ITEM_CATEGORIES).find(([, subcategories]) =>
            subcategories.some(subcategory => item.category.endsWith(`Unique ${subcategory}`))
        )?.[0];

        if (uniqueBases[item.type]) {
            if (isItemFound) {
                uniqueBases[item.type].foundUniqueItems.push(itemWithKey);
            } else {
                uniqueBases[item.type].notFoundUniqueItems.push(itemWithKey);
            }
        } else {
            const base = Object.entries(baseItems).find(
                ([, baseItem]) => baseItem.name === item.type
            );
            uniqueBases[item.type] = {
                base: base ? { ...base[1], key: base[0] } : { name: item.type },
                ...(isItemFound
                    ? { foundUniqueItems: [itemWithKey], notFoundUniqueItems: [] }
                    : { foundUniqueItems: [], notFoundUniqueItems: [itemWithKey] }),
                hide: hasActiveFilter && !selectedFilters[`Unique ${itemType}`],
            };
        }
    });

    return uniqueBases;
};

export const getRemainingSetBases = (
    setItems: Record<string, SetItem>,
    baseItems: Record<string, BaseItem>,
    grailProgress: Record<string, GrailProgressItem>,
    selectedFilters: Record<string, boolean>
): Record<string, SetBase> => {
    const foundItemKeys = Object.values(grailProgress)
        .filter(item => !!item.found)
        .map(item => item.itemKey);

    const setBases: Record<string, SetBase> = {};
    const hasActiveFilter = Object.values(selectedFilters).some(val => val);

    Object.entries(setItems).forEach(([key, item]) => {
        const itemWithKey = { ...item, key };
        const isItemFound = foundItemKeys.includes(key);

        if (setBases[item.type]) {
            if (isItemFound) {
                setBases[item.type].foundSetItems.push(itemWithKey);
            } else {
                setBases[item.type].notFoundSetItems.push(itemWithKey);
            }
        } else {
            const base = Object.entries(baseItems).find(
                ([, baseItem]) => baseItem.name === item.type
            );
            setBases[item.type] = {
                base: base ? { ...base[1], key: base[0] } : { name: item.type },
                ...(isItemFound
                    ? { foundSetItems: [itemWithKey], notFoundSetItems: [] }
                    : { foundSetItems: [], notFoundSetItems: [itemWithKey] }),
                hide: hasActiveFilter && !selectedFilters["Set Items"],
            };
        }
    });

    return setBases;
};
