import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRunewords } from "@/hooks/useRunewords";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/runewords")({
    component: RunewordsPage,
});

function RunewordsPage() {
    const { data, loading, error } = useRunewords();

    useEffect(() => {
        // console.log(`runewords: `, data);
    }, [data]);

    if (error) {
        return (
            <div className="max-w-2xl mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Something went wrong when loading runewords. Please refresh the page or try
                        again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (loading) {
        return null;
    }

    return <div className="pt-4">Placeholder</div>;
}
