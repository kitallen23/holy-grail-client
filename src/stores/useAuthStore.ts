import { checkAuth, logout as apiLogout, type User } from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";
import { useGrailProgressStore } from "./useGrailProgressStore";
import { queryClient } from "@/lib/queryClient";
import { useGrailPageStore } from "./useGrailPageStore";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isLoggingOut: boolean;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    isLoading: true,
    isLoggingOut: false,

    checkAuth: async () => {
        try {
            const userData = await checkAuth();
            set({ user: userData, isLoading: false });
        } catch {
            set({ user: null, isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await apiLogout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Clear our progress store
            useGrailProgressStore.getState().setItems(undefined);
            useGrailPageStore.getState().setPageContents("Summary");

            // Remove cached user data from react-query
            queryClient.removeQueries({ queryKey: ["grail-progress"] });

            set({ user: null, isLoggingOut: false });
            toast.success("You've been signed out.");
        }
    },
}));

// Initialize auth check on store creation
useAuthStore.getState().checkAuth();
