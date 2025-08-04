import { useGrailProgressStore } from "@/stores/useGrailProgressStore";

export const useGrailItem = (itemKey: string) => {
    return useGrailProgressStore(
        state => {
            const item = state.items?.[itemKey];
            return {
                key: itemKey,
                found: item?.found ?? false,
                foundAt: item?.foundAt ?? "",
                setFound: (value: boolean) => state.setFound(itemKey, value),
            };
        },
        (oldState, newState) =>
            oldState.found === newState.found &&
            oldState.foundAt === newState.foundAt &&
            oldState.key === newState.key
    );
};
