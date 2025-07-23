import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useSearchBar } from "@/stores/useSearchStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/settings/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user, isLoading } = useAuth();
    const { setVisibility } = useSearchBar();

    useEffect(() => {
        setVisibility(false);
        return () => setVisibility(true);
    }, []);

    if (isLoading) {
        return null;
    }

    if (!user) {
        return (
            <div className="max-w-xs mx-auto pt-16 flex flex-col gap-8 text-center">
                <h2 className="text-lg leading-none font-semibold">Sign in to access settings</h2>
                <LoginForm />
            </div>
        );
    }

    return (
        <div className="max-w-xs mx-auto pt-16 flex flex-col gap-8 text-center">
            Signed in, now render settings
        </div>
    );
}
