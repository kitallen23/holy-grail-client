import { create } from "zustand";
import { useDebounce } from "@/hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";

interface SearchStore {
    searchString: string;
    setSearchString: (value: string) => void;
    clearSearch: () => void;
}

const useSearchStore = create<SearchStore>(set => ({
    searchString: "",
    setSearchString: (value: string) => set({ searchString: value }),
    clearSearch: () => set({ searchString: "" }),
}));

export const useDebouncedSearch = () => {
    const searchString = useSearchStore(state => state.searchString);
    const debouncedSearchString = useDebounce(searchString, SEARCH_DEBOUNCE_DELAY);

    return {
        searchString,
        debouncedSearchString,
        setSearchString: useSearchStore(state => state.setSearchString),
        clearSearch: useSearchStore(state => state.clearSearch),
    };
};
