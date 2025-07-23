import { checkAuth, logout as apiLogout, type User } from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";
import { useGrailProgressStore } from "./useGrailProgressStore";
import { queryClient } from "@/lib/queryClient";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    isLoading: true,

    checkAuth: async () => {
        try {
            const userData = await checkAuth();
            set({ user: userData, isLoading: false });
        } catch {
            set({ user: null, isLoading: false });
        }
    },

    logout: async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Clear our progress store
            useGrailProgressStore.getState().setItems(undefined);

            // Remove cached user data from react-query
            queryClient.removeQueries({ queryKey: ["grail-progress"] });

            set({ user: null });
            toast.success("You've been signed out.");
        }
    },
}));

// Initialize auth check on store creation
useAuthStore.getState().checkAuth();
