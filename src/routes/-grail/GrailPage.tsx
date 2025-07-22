import { useGrailProgress, useItems } from "@/hooks/queries";
import GrailStatsTable from "./GrailStatsTable";
import GrailRemainingItemSummary from "./GrailRemainingItemSummary";
import GrailItemList from "./GrailItemList";
import Heading from "@/components/Heading";
import { useDebouncedSearch } from "@/stores/useSearchStore";
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
import { CircleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PAGE_CONTENTS_KEYS = ["Summary", "Item List"] as const;

export default function GrailPage() {
    const { debouncedSearchString } = useDebouncedSearch();
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
        if (_grailProgress) {
            setGrailItems(_grailProgress);
        }
    }, [_grailProgress]);

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
        return null;
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
                    <div className="grid max-w-lg mx-auto w-full">
                        <Heading className="text-destructive">Statistics</Heading>
                        <GrailStatsTable
                            uniqueItems={uniqueItems!}
                            setItems={setItems!}
                            runes={runes!}
                            grailProgress={grailProgress}
                        />
                    </div>

                    <Heading className="text-destructive">Remaining Grail Items</Heading>
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
