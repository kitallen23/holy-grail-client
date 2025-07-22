import { createFileRoute } from "@tanstack/react-router";
import GrailPage from "@/routes/-grail/GrailPage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import DiscordIcon from "@/components/DiscordIcon";
import GoogleIcon from "@/components/GoogleIcon";
import { useEffect } from "react";
import { useSearchBar } from "@/stores/useSearchStore";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user, isLoading } = useAuth();
    const { setVisibility } = useSearchBar();

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    const handleDiscordLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
    };

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
                <div className="flex flex-col gap-4">
                    <Button className="gap-2" onClick={handleDiscordLogin}>
                        <DiscordIcon />
                        Continue with Discord
                    </Button>
                    <Button className="gap-2" onClick={handleGoogleLogin}>
                        <GoogleIcon />
                        Continue with Google
                    </Button>
                </div>
            </div>
        );
    }

    return <GrailPage />;
}
