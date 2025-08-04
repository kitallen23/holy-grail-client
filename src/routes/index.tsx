import { createFileRoute } from "@tanstack/react-router";
import GrailPage from "@/routes/-grail/-GrailPage";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useSearchBar } from "@/stores/useSearchStore";
import LoginForm from "@/components/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";

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
        return (
            <div className="max-w-xs mx-auto pt-16 flex flex-col gap-8 text-center opacity-20">
                <div className="pb-1 flex justify-center items-center h-9">
                    <Skeleton className="w-24 h-6" />
                </div>
                <div className="flex flex-col gap-4">
                    <div className="h-8 flex items-center justify-center px-3">
                        <Skeleton className="w-full max-w-64 h-4" />
                    </div>
                    <div className="h-8 flex items-center justify-center px-3">
                        <Skeleton className="w-full max-w-46 h-4" />
                    </div>
                    <div className="h-8 flex items-center justify-center px-3">
                        <Skeleton className="w-full max-w-52 h-4" />
                    </div>
                </div>
            </div>
        );
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
