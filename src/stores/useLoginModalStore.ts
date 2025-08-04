import { create } from "zustand";

interface LoginModalState {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const useLoginModalStore = create<LoginModalState>(set => ({
    open: false,
    onOpenChange: (open: boolean) => set({ open }),
}));
