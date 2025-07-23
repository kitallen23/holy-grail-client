import Heading from "@/components/Heading";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useImportStore } from "@/stores/useImport";
import { useSearchBar } from "@/stores/useSearchStore";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import ImportTomeOfD2Data from "./-ImportTomeOfD2Data";

export const Route = createFileRoute("/settings/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user, isLoading } = useAuth();
    const { setVisibility } = useSearchBar();

    const { type, setFile } = useImportStore();

    useEffect(() => {
        setVisibility(false);
        return () => setVisibility(true);
    }, []);

    const onTomeOfD2FileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile("Tome of D2", file);
        }
    };

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

    if (type === "Tome of D2") {
        return <ImportTomeOfD2Data />;
    }

    return (
        <div className="max-w-lg mx-auto pt-8 flex flex-col gap-4">
            <Heading className="text-destructive">Import Data</Heading>
            <div className="flex flex-col gap-2">
                <div>
                    Use the button below to import a{" "}
                    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        .txt
                    </code>{" "}
                    file from the Tome of D2 mobile application.
                </div>
                <div className="flex justify-start">
                    <input
                        type="file"
                        accept=".txt"
                        onChange={onTomeOfD2FileSelect}
                        style={{ display: "none" }}
                        id="tome-of-d2-file-input"
                    />
                    <Button
                        onClick={() => document.getElementById("tome-of-d2-file-input")?.click()}
                    >
                        Import from Tome of D2
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    Use the button below to import a{" "}
                    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        .json
                    </code>{" "}
                    file from{" "}
                    <a
                        href="https://d2-holy-grail.herokuapp.com"
                        className="underline-offset-4 hover:underline text-primary hover:text-primary/90"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        d2-holy-grail
                    </a>
                    .
                </div>
                <div className="flex justify-start">
                    <Button>Import from d2-holy-grail</Button>
                </div>
            </div>
        </div>
    );
}
