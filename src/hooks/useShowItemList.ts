import { useGrailPageStore } from "@/stores/useGrailPageStore";
import { useDebouncedSearch } from "@/stores/useSearchStore";

export const useShowItemList = () => {
    const { debouncedSearchString } = useDebouncedSearch();
    const { pageContents } = useGrailPageStore();

    return debouncedSearchString || pageContents === "Item List";
};
