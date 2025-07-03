import { useAuthStore } from "@/stores/useAuthStore";

export const useAuth = () => {
    const { user, isLoading, checkAuth, logout } = useAuthStore();
    return { user, isLoading, checkAuth, logout };
};
