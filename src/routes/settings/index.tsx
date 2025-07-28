import Heading from "@/components/Heading";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSearchBar } from "@/stores/useSearchStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ImportGrailData from "./-ImportGrailData";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { clearUserItems } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useGrailProgressStore } from "@/stores/useGrailProgressStore";
import { toast } from "sonner";
import { useGrailPageStore } from "@/stores/useGrailPageStore";
import { delay } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ExportGrailData from "./-ExportGrailData";

export const Route = createFileRoute("/settings/")({
    component: RouteComponent,
});

const IMPORT_TYPES = {
    Backup: {
        label: "Backup",
        accept: ".json",
    },
    "Tome of D2": {
        label: "Tome of D2",
        accept: ".txt",
    },
    "d2-holy-grail": {
        label: "d2-holy-grail",
        accept: ".json",
    },
} as const;
export type ImportType = keyof typeof IMPORT_TYPES;

function RouteComponent() {
    const { user, isLoading } = useAuth();
    const { setVisibility } = useSearchBar();
    const navigate = useNavigate({ from: "/settings" });
    const { setItems } = useGrailProgressStore();
    const { setPageContents } = useGrailPageStore();

    const [exportType, setExportType] = useState<ImportType | undefined>(undefined);
    const [exportPage, setExportPage] = useState<boolean>(false);
    const [importType, setImportType] = useState<ImportType | undefined>(undefined);
    const [importFile, setImportFile] = useState<File | undefined>(undefined);

    const setFile = (type?: ImportType, file?: File) => {
        if (type === undefined || file === undefined) {
            setImportType(undefined);
            setImportFile(undefined);
        } else {
            setImportType(type);
            setImportFile(file);
        }
    };

    const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImportFile(file);
        }
    };

    useEffect(() => {
        setVisibility(false);
        return () => setVisibility(true);
    }, []);

    const [resetModal, setResetModal] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const onResetHolyGrail = async () => {
        if (isResetting) {
            return;
        }

        setIsResetting(true);
        try {
            await Promise.all([clearUserItems(), delay(1000)]);

            // Clear our progress store
            setItems(undefined);
            setPageContents("Summary");

            // Remove cached user data from react-query
            queryClient.removeQueries({ queryKey: ["grail-progress"] });

            toast.success("Your grail has been reset.");
            navigate({ to: "/" });
        } catch (error) {
            console.error(`Error: `, error);
            toast.error("Something went wrong when resetting your grail. Please try again later.");
        } finally {
            setIsResetting(false);
        }
    };

    const onExportCancel = () => {
        setExportPage(false);
        setExportType(undefined);
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

    if (importType && importFile) {
        return <ImportGrailData importType={importType} file={importFile} setFile={setFile} />;
    }
    if (exportType && exportPage) {
        return <ExportGrailData exportType={exportType} onCancel={onExportCancel} />;
    }

    return (
        <>
            <div className="max-w-lg mx-auto pt-8 flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <Heading className="text-destructive">Import Holy Grail Data</Heading>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 flex-wrap">
                            <Select
                                value={importType || ""}
                                onValueChange={value => setImportType(value as ImportType)}
                            >
                                <SelectTrigger>
                                    {importType ? (
                                        <span className="text-muted-foreground">Import from:</span>
                                    ) : null}
                                    <SelectValue placeholder="Import from..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(IMPORT_TYPES).map(key => (
                                        <SelectItem key={key} value={key}>
                                            {key === "Backup" ? "Backup (this website)" : key}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="file"
                                accept={importType ? IMPORT_TYPES[importType].accept : undefined}
                                onChange={onFileSelect}
                                disabled={!importType}
                                style={{ display: "none" }}
                                id="import-file-input"
                            />
                            <Button
                                onClick={() =>
                                    document.getElementById("import-file-input")?.click()
                                }
                                disabled={!importType}
                            >
                                Choose file...
                            </Button>
                        </div>
                        {importType === "Backup" ? (
                            <div className="text-muted-foreground">
                                Please choose a backup file that was created using the export
                                feature.
                            </div>
                        ) : importType === "Tome of D2" ? (
                            <div className="text-muted-foreground">
                                Please choose a{" "}
                                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                    .txt
                                </code>{" "}
                                file that was created using the backup feature of the Tome of D2
                                mobile application.
                            </div>
                        ) : importType === "d2-holy-grail" ? (
                            <div className="text-muted-foreground">
                                Please choose a{" "}
                                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                    .json
                                </code>{" "}
                                file that was created using the export feature of the{" "}
                                <a
                                    href="https://d2-holy-grail.herokuapp.com"
                                    className="underline-offset-4 hover:underline text-primary hover:text-primary/90"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    d2-holy-grail
                                </a>{" "}
                                website.
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <Heading className="text-destructive">Export Holy Grail Data</Heading>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 flex-wrap">
                            <Select
                                value={exportType || ""}
                                onValueChange={value => setExportType(value as ImportType)}
                            >
                                <SelectTrigger>
                                    {exportType ? (
                                        <span className="text-muted-foreground">Export for:</span>
                                    ) : null}
                                    <SelectValue placeholder="Export for..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(IMPORT_TYPES).map(key => (
                                        <SelectItem key={key} value={key}>
                                            {key === "Backup" ? "Backup (this website)" : key}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={() => setExportPage(true)} disabled={!exportType}>
                                Export
                            </Button>
                        </div>
                        {exportType === "Backup" ? (
                            <div className="text-muted-foreground">
                                Creates a backup of your Holy Grail so you can restore it at a later
                                stage.
                            </div>
                        ) : exportType === "Tome of D2" ? (
                            <div className="text-muted-foreground">
                                Creates a{" "}
                                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                    .txt
                                </code>{" "}
                                file that can be used to restore Holy Grail data in the Tome of D2
                                mobile application. Note: this file is only compatible with Tome of
                                D2 v5.
                            </div>
                        ) : exportType === "d2-holy-grail" ? (
                            <div className="text-muted-foreground">
                                Creates a{" "}
                                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                    .json
                                </code>{" "}
                                file in the format that{" "}
                                <a
                                    href="https://d2-holy-grail.herokuapp.com"
                                    className="underline-offset-4 hover:underline text-primary hover:text-primary/90"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    d2-holy-grail
                                </a>{" "}
                                uses on their website.
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <Heading className="text-destructive">Reset Holy Grail</Heading>
                    <div className="flex flex-col gap-2">
                        <div>
                            Use the button below to reset all of your Holy Grail progress. This
                            cannot be undone. It is recommended that you export your grail data
                            before doing this.
                        </div>
                        <div className="flex justify-start">
                            <Button variant="destructive" onClick={() => setResetModal(true)}>
                                <Trash2Icon />
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={resetModal || isResetting} onOpenChange={() => setResetModal(false)}>
                <DialogContent className="w-[90vw] max-w-sm" aria-describedby={undefined}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Reset Holy Grail</DialogTitle>
                    </DialogHeader>
                    <div>
                        Doing this will reset all of your Holy Grail progress. This cannot be
                        undone.
                    </div>
                    <div>Are you sure you wish to reset your Holy Grail?</div>
                    <div className="flex justify-center">
                        <Button
                            variant="destructive"
                            onClick={onResetHolyGrail}
                            disabled={isResetting}
                        >
                            {isResetting ? <LoaderCircleIcon className="animate-spin" /> : null}
                            Yes, I&apos;m sure
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
