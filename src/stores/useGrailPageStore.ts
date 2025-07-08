import { create } from "zustand";

export const PAGE_CONTENTS_KEYS = ["Summary", "Item List"] as const;
type PageContentsKey = (typeof PAGE_CONTENTS_KEYS)[number];

interface PageStore {
    pageContents: PageContentsKey;
    setPageContents: (content: PageContentsKey) => void;
}

export const useGrailPageStore = create<PageStore>(set => ({
    pageContents: "Summary", // default value
    setPageContents: content => set({ pageContents: content }),
}));
