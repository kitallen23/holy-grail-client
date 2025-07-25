import Heading from "@/components/Heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGrailProgress, useItems } from "@/hooks/queries";
import {
    getItemsToImport_D2HolyGrail,
    getItemsToImport_TomeOfD2,
    type External_D2HolyGrailData,
    type External_TomeOfD2GrailData,
} from "@/lib/adapters/import";
import { bulkSetUserItems } from "@/lib/api";
import { delay } from "@/lib/utils";
import { useGrailPageStore } from "@/stores/useGrailPageStore";
import { useGrailProgressStore } from "@/stores/useGrailProgressStore";
import { useNavigate } from "@tanstack/react-router";
import { CircleAlert, CloudCheckIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ImportType } from ".";

type Props = {
    file?: File;
    importType?: ImportType;
    setFile: {
        (type: ImportType, file: File): void;
        (): void;
    };
};

const ImportGrailData = ({ file, importType, setFile }: Props) => {
    const navigate = useNavigate({ from: "/settings" });
    const { data, isFetching, error } = useItems(["uniqueItems", "setItems", "runes"]);
    const uniqueItems = data?.uniqueItems;
    const setItems = data?.setItems;
    const runes = data?.runes;
    const { setPageContents } = useGrailPageStore();

    const totalItemCount =
        Object.keys(uniqueItems || {}).length +
        Object.keys(setItems || {}).length +
        Object.keys(runes || {}).length;

    const {
        data: _grailProgress,
        isFetching: isFetchingGrailProgress,
        error: grailProgressError,
    } = useGrailProgress();

    const { items: grailProgress, setItems: setGrailItems, bulkSetFound } = useGrailProgressStore();
    const foundItemCount = Object.keys(grailProgress || {}).length;

    useEffect(() => {
        // Only initialise our grailProgress store's items if it's not already populated
        if (_grailProgress && !grailProgress) {
            setGrailItems(_grailProgress);
        }
    }, [_grailProgress, grailProgress]);

    const [fileContents, setFileContents] = useState<
        External_TomeOfD2GrailData | External_D2HolyGrailData
    >();
    const [fileError, setFileError] = useState(false);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const text = e.target?.result as string;
                    const jsonData = JSON.parse(text);

                    setFileContents(jsonData);
                } catch (error) {
                    console.error("Invalid contents of file:", error);
                    setFileError(true);
                }
            };
            reader.readAsText(file);
        }
    }, [file]);

    const [externalImportData, setExternalImportData] = useState<{
        found: string[];
        notFound: string[];
    }>();
    const externalCount =
        (externalImportData?.found.length ?? 0) + (externalImportData?.notFound.length ?? 0);

    useEffect(() => {
        if (grailProgress && fileContents && data) {
            if (importType === "Tome of D2") {
                setExternalImportData(
                    getItemsToImport_TomeOfD2(
                        grailProgress,
                        fileContents as External_TomeOfD2GrailData,
                        data
                    )
                );
            } else if (importType === "d2-holy-grail") {
                setExternalImportData(
                    getItemsToImport_D2HolyGrail(
                        grailProgress,
                        fileContents as External_D2HolyGrailData,
                        data
                    )
                );
            }
        }
    }, [grailProgress, fileContents, data]);

    const onCancel = () => {
        setFile();
    };

    const [isImporting, setIsImporting] = useState(false);
    const onImport = async () => {
        if (
            isImporting ||
            !externalImportData?.notFound ||
            externalImportData.notFound.length < 1
        ) {
            return;
        }

        setIsImporting(true);
        try {
            const payload: { itemKey: string }[] = externalImportData?.notFound.map(itemKey => ({
                itemKey,
            }));

            await Promise.all([bulkSetUserItems(payload), delay(1000)]);

            // Set items in our local store
            bulkSetFound(payload);

            // Clear our import file state & redirect to homepage
            toast.success(`Imported ${externalImportData.notFound.length} items successfully.`);
            setPageContents("Summary");
            navigate({ to: "/" });
            setFile();
        } catch (error) {
            console.error(`Error: `, error);
            toast.error("Something went wrong when importing. Please try again later.");
        } finally {
            setIsImporting(false);
        }
    };

    const [toSkipDialog, setToSkipDialog] = useState(false);
    const [toAddDialog, setToAddDialog] = useState(false);

    if (error || grailProgressError) {
        return (
            <div className="max-w-lg mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Something went wrong when loading data. Please refresh the page or try again
                        later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    if (fileError) {
        return (
            <div className="max-w-lg mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        <div>Something went wrong when processing the file.</div>
                        {importType === "Tome of D2" ? (
                            <div>
                                The file you&apos;re importing may be malformed. Please check you
                                exported it correctly from Tome of D2 and try again.
                            </div>
                        ) : importType === "d2-holy-grail" ? (
                            <div>
                                The file you&apos;re importing may be malformed. Please check you
                                exported it correctly from{" "}
                                <a
                                    href="https://d2-holy-grail.herokuapp.com"
                                    className="underline-offset-4 underline text-destructive hover:text-destructive/90"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    d2-holy-grail
                                </a>{" "}
                                and try again.
                            </div>
                        ) : null}
                        <div>
                            If the issue persists, please open an issue on{" "}
                            <a
                                href="https://github.com/kitallen23/holy-grail-client"
                                className="underline-offset-4 underline text-destructive hover:text-destructive/90"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub
                            </a>
                            .
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const isLoading = isFetching || isFetchingGrailProgress;

    if (isLoading) {
        return (
            <div className="max-w-lg mx-auto pt-8 flex flex-col gap-4 opacity-20">
                <div className="pb-1 flex justify-center items-center h-9">
                    <Skeleton className="w-48 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="h-6 flex items-center">
                        <Skeleton className="w-64 h-4" />
                    </div>
                    <div className="h-6 flex items-center">
                        <Skeleton className="w-28 h-4" />
                    </div>
                    <div className="h-6 flex items-center">
                        <Skeleton className="w-32 h-4" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-lg mx-auto pt-8 flex flex-col gap-4">
                <Heading className="text-destructive">Import Data</Heading>
                <div className="flex flex-col gap-1">
                    <div>
                        Grail items before import: {foundItemCount} / {totalItemCount}
                    </div>
                    <div>Items to import: {externalCount}</div>
                    <div className="ml-8 flex">
                        {externalImportData?.found.length ? (
                            <div
                                className="text-muted-foreground underline-offset-4 hover:underline cursor-default"
                                onClick={() => setToSkipDialog(true)}
                            >
                                To skip (already found in current grail):{" "}
                                {externalImportData?.found.length}
                            </div>
                        ) : (
                            <div className="text-muted-foreground">
                                To skip (already found in current grail):{" "}
                                {externalImportData?.found.length}
                            </div>
                        )}
                    </div>
                    <div className="ml-8">
                        {externalImportData?.notFound.length ? (
                            <div
                                className="underline-offset-4 hover:underline cursor-default"
                                onClick={() => setToAddDialog(true)}
                            >
                                To add to grail: {externalImportData?.notFound.length}
                            </div>
                        ) : (
                            <div className="underline-offset-4">
                                To add to grail: {externalImportData?.notFound.length}
                            </div>
                        )}
                    </div>
                    <div className="font-semibold">
                        Grail items after import:{" "}
                        {foundItemCount + (externalImportData?.notFound.length ?? 0)} /{" "}
                        {totalItemCount}
                    </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onImport}
                        disabled={(externalImportData?.notFound.length ?? 0) < 1 || isImporting}
                    >
                        {isImporting ? (
                            <LoaderCircleIcon className="animate-spin" />
                        ) : (
                            <CloudCheckIcon />
                        )}
                        Import {externalImportData?.notFound.length || 0} items into grail
                    </Button>
                </div>
            </div>
            <Dialog open={toAddDialog} onOpenChange={() => setToAddDialog(false)}>
                <DialogContent
                    className="w-[90vw] max-w-xs max-h-[calc(100dvh-2rem)] overflow-y-auto"
                    aria-describedby={undefined}
                >
                    <DialogHeader className="mb-4">
                        <DialogTitle>Items To Add</DialogTitle>
                    </DialogHeader>
                    <ul className="space-y-1 list-disc list-inside">
                        {externalImportData?.notFound.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </DialogContent>
            </Dialog>
            <Dialog open={toSkipDialog} onOpenChange={() => setToSkipDialog(false)}>
                <DialogContent
                    className="w-[90vw] max-w-xs max-h-[calc(100dvh-2rem)] overflow-y-auto"
                    aria-describedby={undefined}
                >
                    <DialogHeader className="mb-4">
                        <DialogTitle>Items To Skip (Already Found)</DialogTitle>
                    </DialogHeader>
                    <ul className="space-y-1 list-disc list-inside">
                        {externalImportData?.found.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ImportGrailData;
