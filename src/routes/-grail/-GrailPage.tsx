import { useGrailProgress, useItems } from "@/hooks/queries";
import GrailStatsTable from "./-GrailStatsTable";
import GrailRemainingItemSummary from "./-GrailRemainingItemSummary";
import GrailItemList from "./-GrailItemList";
import Heading from "@/components/Heading";
import { useDebouncedSearchString, useSearchFilters } from "@/stores/useSearchStore";
import type { Items } from "@/types/items";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useGrailPageStore } from "@/stores/useGrailPageStore";
import { useGrailProgressStore } from "@/stores/useGrailProgressStore";
import { useEffect } from "react";
import { BadgeInfoIcon, CircleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "@tanstack/react-router";
import GrailHeatmap from "./-GrailHeatmap";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_CONTENTS_KEYS = ["Summary", "Item List"] as const;

export default function GrailPage() {
    const { debouncedSearchString } = useDebouncedSearchString();
    const { setPageFilters } = useSearchFilters();
    const {
        data,
        isFetching: isFetchingItems,
        error: itemsError,
    } = useItems(["baseItems", "runes", "uniqueItems", "setItems"]);
    const baseItems = data?.baseItems;
    const uniqueItems = data?.uniqueItems;
    const setItems = data?.setItems;
    const runes = data?.runes;

    const { pageContents, setPageContents } = useGrailPageStore();

    const {
        data: _grailProgress,
        isFetching: isFetchingGrailProgress,
        error: grailProgressError,
    } = useGrailProgress();

    const { items: grailProgress, setItems: setGrailItems } = useGrailProgressStore();

    useEffect(() => {
        if (_grailProgress && !grailProgress) {
            setGrailItems(_grailProgress);
        }
    }, [_grailProgress, grailProgress]);

    useEffect(() => {
        const filters = [
            {
                id: "item_type",
                label: "Item Type",
                options: [
                    { id: "Unique Weapons", label: "Unique Weapons", value: false },
                    { id: "Unique Armor", label: "Unique Armor", value: false },
                    { id: "Unique Other", label: "Unique Other", value: false },
                    { id: "Set Items", label: "Set Items", value: false },
                    { id: "Runes", label: "Runes", value: false },
                ],
            },
        ];
        setPageFilters(filters);

        return () => setPageFilters(null);
    }, []);

    const isFetching = isFetchingItems || isFetchingGrailProgress;
    const error = itemsError || grailProgressError;

    if (error) {
        return (
            <div className="max-w-2xl mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Something went wrong when loading holy grail. Please refresh the page or try
                        again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isFetching || !data || !grailProgress) {
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

    return (
        <div className="pt-4 pb-8 grid grid-cols-1 gap-4">
            {debouncedSearchString ? null : (
                <div className="flex justify-center">
                    <NavigationMenu orientation="horizontal">
                        <NavigationMenuList className="bg-popover p-1 rounded-md border">
                            {PAGE_CONTENTS_KEYS.map(key => (
                                <NavigationMenuItem key={key}>
                                    <NavigationMenuLink asChild className="py-1 px-1.5" indicator>
                                        <button
                                            onClick={() => setPageContents(key)}
                                            data-active={pageContents === key}
                                        >
                                            {key}
                                        </button>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            )}
            {pageContents === "Summary" && !debouncedSearchString ? (
                <>
                    {Object.keys(grailProgress).length < 1 ? (
                        <Alert variant="default" className="max-w-lg mx-auto">
                            <BadgeInfoIcon />
                            <AlertTitle>Welcome!</AlertTitle>
                            <AlertDescription>
                                <div>
                                    If you have existing Holy Grail data from another application,
                                    you can import it in the{" "}
                                    <Link
                                        to="/settings"
                                        className="underline-offset-4 underline text-foreground/80 hover:text-foreground/90"
                                    >
                                        settings page
                                    </Link>
                                    .
                                </div>
                                <div>Good luck on your journey!</div>
                            </AlertDescription>
                        </Alert>
                    ) : null}
                    <div className="grid max-w-lg mx-auto w-full">
                        <Heading className="text-destructive">Statistics</Heading>
                        <GrailStatsTable
                            uniqueItems={uniqueItems!}
                            setItems={setItems!}
                            runes={runes!}
                            grailProgress={grailProgress}
                        />
                    </div>

                    <GrailHeatmap />

                    <GrailRemainingItemSummary
                        uniqueItems={uniqueItems!}
                        setItems={setItems!}
                        baseItems={baseItems!}
                        grailProgress={grailProgress}
                    />
                </>
            ) : null}
            <GrailItemList data={data as Items} />
        </div>
    );
}
