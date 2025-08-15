import { useGrailProgressStore } from "@/stores/useGrailProgressStore";

export const useGrailItem = (itemKey: string) => {
    return useGrailProgressStore(
        state => {
            const item = state.items?.[itemKey];
            return {
                key: itemKey,
                found: item?.found ?? false,
                foundAt: item?.foundAt ?? "",
                setFound: (value: boolean, pathname?: string) =>
                    state.setFound(itemKey, value, pathname),
            };
        },
        (oldState, newState) =>
            oldState.found === newState.found &&
            oldState.foundAt === newState.foundAt &&
            oldState.key === newState.key
    );
};
