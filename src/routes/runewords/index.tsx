import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import RunewordCategory from "@/routes/runewords/-RunewordCategory";

import { useRunewords } from "@/hooks/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/runewords/")({
    component: RunewordsPage,
});

function RunewordsPage() {
    const { data, isFetching, error } = useRunewords();

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

    if (isFetching || !data) {
        return null;
    }

    return (
        <div className="pt-4 grid grid-cols-1 gap-4">
            <div className="grid gap-4">
                <RunewordCategory data={data} category="Weapons" label="Weapons" />
                <RunewordCategory data={data} category="Body Armor" label="Body Armor" />
                <RunewordCategory data={data} category="Shields" label="Shields" />
                <RunewordCategory data={data} category="Helmets" label="Helmets" />
            </div>
        </div>
    );
}
