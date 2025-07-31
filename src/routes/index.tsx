import { createFileRoute } from "@tanstack/react-router";
import GrailPage from "@/routes/-grail/-GrailPage";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useSearchBar } from "@/stores/useSearchStore";
import LoginForm from "@/components/LoginForm";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user, isLoading } = useAuth();
    const { setVisibility } = useSearchBar();

    useEffect(() => {
        setVisibility(!!user);
        return () => setVisibility(true);
    }, [user]);

    if (isLoading) {
        return null;
    }

    if (!user) {
        return (
            <div className="max-w-xs mx-auto pt-16 flex flex-col gap-8 text-center">
                <h2 className="text-lg leading-none font-semibold">
                    Sign in to access the Holy Grail
                </h2>
                <LoginForm />
            </div>
        );
    }

    return <GrailPage />;
}
