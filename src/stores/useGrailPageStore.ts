import { create } from "zustand";

export const PAGE_CONTENTS_KEYS = ["Summary", "Item List"] as const;
type PageContentsKey = (typeof PAGE_CONTENTS_KEYS)[number];

interface PageStore {
    pageContents: PageContentsKey;
    setPageContents: (content: PageContentsKey) => void;

    uniqueItemCount: number;
    setNumFilteredUniqueItems: (value: number) => void;

    setItemCount: number;
    setNumFilteredSetItems: (value: number) => void;

    runeCount: number;
    setNumFilteredRunes: (value: number) => void;
}

export const useGrailPageStore = create<PageStore>(set => ({
    pageContents: "Summary",
    setPageContents: content => set({ pageContents: content }),

    uniqueItemCount: 0,
    setNumFilteredUniqueItems: value => set({ uniqueItemCount: value }),

    setItemCount: 0,
    setNumFilteredSetItems: value => set({ setItemCount: value }),

    runeCount: 0,
    setNumFilteredRunes: value => set({ runeCount: value }),
}));
