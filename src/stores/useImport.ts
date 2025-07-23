import { create } from "zustand";

export type ExternalType = "Tome of D2" | "d2-holy-grail";

interface ImportStore {
    type?: ExternalType;
    file?: File;
    setFile: {
        (type: ExternalType, file?: File): void;
        (): void;
    };
}

export const useImportStore = create<ImportStore>(set => ({
    type: undefined,
    file: undefined,
    setFile: (type?: ExternalType, file?: File) => {
        if (type === undefined || file === undefined) {
            set({ type: undefined, file: undefined });
        } else {
            set({ type, file });
        }
    },
}));
