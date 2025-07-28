import { useGrailProgress, useItems } from "@/hooks/queries";
import type { ImportType } from ".";
import { useGrailProgressStore } from "@/stores/useGrailProgressStore";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import type { GrailProgressItem } from "@/lib/api";
import { delay } from "@/lib/utils";
import {
    prepareExportData_Backup,
    prepareExportData_D2HolyGrail,
    prepareExportData_TomeOfD2,
    type External_D2HolyGrailData,
    type External_TomeOfD2GrailData,
    type Internal_GrailData,
} from "@/lib/adapters/import-export";
import { toast } from "sonner";
import type { Items } from "@/types/items";

type Props = {
    exportType: ImportType;
    onCancel: () => void;
};

const ExportGrailData = ({ exportType, onCancel }: Props) => {
    const { data, isFetching, error } = useItems(["uniqueItems", "setItems", "runes", "baseItems"]);
    const uniqueItems = data?.uniqueItems;
    const setItems = data?.setItems;
    const runes = data?.runes;

    const totalItemCount =
        Object.keys(uniqueItems || {}).length +
        Object.keys(setItems || {}).length +
        Object.keys(runes || {}).length;

    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        const wait = async () => {
            await delay(1000);
            setIsReady(true);
        };
        wait();
    }, []);

    const {
        data: _grailProgress,
        isFetching: isFetchingGrailProgress,
        error: grailProgressError,
    } = useGrailProgress();

    const { items: grailProgress, setItems: setGrailItems } = useGrailProgressStore();
    const foundItemCount = Object.keys(grailProgress || {}).length;

    useEffect(() => {
        // Only initialise our grailProgress store's items if it's not already populated
        if (_grailProgress && !grailProgress) {
            setGrailItems(_grailProgress);
        }
    }, [_grailProgress, grailProgress]);

    const [isExported, setIsExported] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [fileName, setFileName] = useState("");
    const [exportData, setExportData] = useState<{
        count: number;
        data:
            | Internal_GrailData
            | External_TomeOfD2GrailData
            | External_D2HolyGrailData
            | undefined;
    }>({ count: 0, data: undefined });

    const onExport = (
        type: ImportType,
        grailProgress: Record<string, GrailProgressItem>,
        data: Partial<Items>
    ) => {
        setIsExported(false);

        try {
            // Clean up previous URL
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl);
            }

            let exportData: {
                count: number;
                data:
                    | Internal_GrailData
                    | External_TomeOfD2GrailData
                    | External_D2HolyGrailData
                    | undefined;
            };
            if (type === "Backup") {
                exportData = prepareExportData_Backup(grailProgress);
            } else if (type === "Tome of D2") {
                exportData = prepareExportData_TomeOfD2(grailProgress, data as Items);
            } else if (type === "d2-holy-grail") {
                exportData = prepareExportData_D2HolyGrail(grailProgress, data as Items);
            } else {
                throw new Error();
            }

            if (!exportData) {
                throw new Error();
            }
            setExportData(exportData);

            const jsonString = JSON.stringify(exportData.data, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const fileExtension = type === "Tome of D2" ? "txt" : "json";
            const filename = `${(type === "Backup" ? "Holy Grail" : type).toLowerCase().replace(/\s+/g, "-")}-backup-${new Date().toISOString().split("T")[0]}.${fileExtension}`;

            // Store for manual download
            setDownloadUrl(url);
            setFileName(filename);

            // Auto download
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(`Error: `, error);
            toast.error("Something went wrong when exporting. Please try again later.");
        } finally {
            setIsExported(true);
        }
    };

    useEffect(() => {
        if (grailProgress && data && Object.keys(grailProgress).length && isReady) {
            onExport(exportType, grailProgress, data);
        }
    }, [exportType, grailProgress, data, isReady]);

    useEffect(() => {
        return () => {
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl);
            }
        };
    }, []);

    if (error || grailProgressError) {
        return (
            <div className="max-w-lg mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Something went wrong when loading data. Please refresh the page or try again
                        later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const isLoading = isFetching || isFetchingGrailProgress || !isReady || !isExported;

    return (
        <div className="max-w-lg mx-auto pt-8 flex flex-col gap-4">
            <Heading className="text-destructive">Export Data</Heading>
            {isLoading ? (
                <div className="flex gap-2 justify-center text-muted-foreground">
                    <LoaderCircleIcon className="animate-spin" />
                    Preparing data...
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-1">
                        <div>
                            Grail items to export: {foundItemCount} / {totalItemCount}
                        </div>
                        <div>Grail items added to file: {exportData.count}</div>
                        {exportType !== "Backup" && exportData.count !== foundItemCount ? (
                            <div className="text-muted-foreground -indent-2 pl-2">
                                Note: Small differences between these numbers are expected due to
                                how each app tracks Holy Grail data.
                            </div>
                        ) : null}
                        {exportType !== "Backup" ? (
                            <div className="text-muted-foreground -indent-2 pl-2">
                                Note: {exportType} doesn&apos;t track runes as part of the Holy
                                Grail.
                            </div>
                        ) : null}
                    </div>

                    <div>
                        Your download should begin automatically. If not,{" "}
                        <a
                            href={downloadUrl}
                            download={fileName}
                            className="underline-offset-4 hover:underline text-foreground/80 hover:text-foreground/90"
                        >
                            click here
                        </a>
                        .
                    </div>
                </>
            )}
            <div className="flex justify-center gap-4 mt-4">
                <Button variant="secondary" onClick={onCancel}>
                    Done
                </Button>
            </div>
        </div>
    );
};

export default ExportGrailData;
