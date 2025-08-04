import { useGrailPageStore } from "@/stores/useGrailPageStore";
import { useDebouncedSearchString } from "@/stores/useSearchStore";

export const useShowItemList = () => {
    const { debouncedSearchString } = useDebouncedSearchString();
    const {
        pageContents,
        uniqueItemCount,
        setItemCount,
        runeCount,
        setNumFilteredUniqueItems,
        setNumFilteredSetItems,
        setNumFilteredRunes,
    } = useGrailPageStore();

    const setFilteredItemCount = (type: "unique" | "set" | "rune", value: number) => {
        const setters = {
            unique: setNumFilteredUniqueItems,
            set: setNumFilteredSetItems,
            rune: setNumFilteredRunes,
        };
        setters[type](value);
    };

    const itemCount = uniqueItemCount + setItemCount + runeCount;

    return {
        shouldDisplay: debouncedSearchString || pageContents === "Item List",
        itemCount,
        setFilteredItemCount,
    };
};
