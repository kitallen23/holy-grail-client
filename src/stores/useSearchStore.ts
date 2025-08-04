import { create } from "zustand";
import { useDebounce } from "@/hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";
import { useEffect } from "react";

export interface FilterOption {
    id: string;
    label: string;
    value: boolean;
}

export interface FilterConfig {
    id: string;
    label: string;
    options: FilterOption[];
}

interface SearchStore {
    isVisible: boolean;
    setVisibility: (visible: boolean) => void;

    searchString: string;
    setSearchString: (value: string) => void;
    clearSearch: () => void;

    debouncedSearchString: string;
    setDebouncedSearchString: (value: string) => void;

    currentPageFilters: FilterConfig[] | null;
    selectedFilters: Record<string, boolean>;

    setPageFilters: (filters: FilterConfig[] | null) => void;
    setFilterValue: (filterId: string, value: boolean) => void;
    clearFilters: () => void;
}

const useSearchStore = create<SearchStore>(set => ({
    isVisible: true,
    setVisibility: visible => set({ isVisible: visible }),

    searchString: "",
    setSearchString: (value: string) => set({ searchString: value }),
    clearSearch: () => set({ searchString: "", debouncedSearchString: "" }),

    debouncedSearchString: "",
    setDebouncedSearchString: (value: string) => set({ debouncedSearchString: value }),

    currentPageFilters: null,
    selectedFilters: {},
    setPageFilters: filters => {
        // Build initial selectedFilters from all filter options
        const initialSelectedFilters: Record<string, boolean> = {};

        if (filters) {
            filters.forEach(filter => {
                filter.options.forEach(option => {
                    initialSelectedFilters[option.id] = option.value;
                });
            });
        }

        set({
            currentPageFilters: filters,
            selectedFilters: initialSelectedFilters,
        });
    },
    setFilterValue: (filterId, value) =>
        set(state => ({
            selectedFilters: { ...state.selectedFilters, [filterId]: value },
        })),
    clearFilters: () => set({ selectedFilters: {} }),
}));

export const useSearchString = () => {
    const searchString = useSearchStore(state => state.searchString);

    return {
        searchString,
        setSearchString: useSearchStore(state => state.setSearchString),
        clearSearch: useSearchStore(state => state.clearSearch),
    };
};

export const useDebouncedSearchString = () => {
    const debouncedSearchString = useSearchStore(state => state.debouncedSearchString);

    return {
        debouncedSearchString,
        clearSearch: useSearchStore(state => state.clearSearch),
    };
};

export const useSearchFilters = () => {
    const currentPageFilters = useSearchStore(state => state.currentPageFilters);
    const selectedFilters = useSearchStore(state => state.selectedFilters);

    return {
        currentPageFilters,
        selectedFilters,
        setPageFilters: useSearchStore(state => state.setPageFilters),
        setFilterValue: useSearchStore(state => state.setFilterValue),
        clearFilters: useSearchStore(state => state.clearFilters),
    };
};

export const useSearchBar = () => {
    const isVisible = useSearchStore(state => state.isVisible);
    return {
        isVisible,
        setVisibility: useSearchStore(state => state.setVisibility),
    };
};

export const useSearchDebounceManager = () => {
    const searchString = useSearchStore(state => state.searchString);
    const setDebouncedSearchString = useSearchStore(state => state.setDebouncedSearchString);
    const debouncedValue = useDebounce(searchString, SEARCH_DEBOUNCE_DELAY);

    useEffect(() => {
        setDebouncedSearchString(debouncedValue);
    }, [debouncedValue, setDebouncedSearchString]);
};
