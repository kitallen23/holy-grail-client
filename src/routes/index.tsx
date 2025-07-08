import { createFileRoute } from "@tanstack/react-router";
import { useGrailProgress, useItems } from "@/hooks/queries";
import GrailStatsTable from "./-grail/GrailStatsTable";
import GrailRemainingItemSummary from "./-grail/GrailRemainingItemSummary";
import Heading from "@/components/Heading";
import { useDebouncedSearch } from "@/stores/useSearchStore";
import GrailItemList from "@/routes/-grail/GrailItemList";
import type { Items } from "@/types/items";

export const Route = createFileRoute("/")({
    component: GrailPage,
});

function GrailPage() {
    const { debouncedSearchString } = useDebouncedSearch();
    const {
        data,
        isFetching: isFetchingItems,
        // error: itemsError,
    } = useItems(["baseItems", "runes", "uniqueItems", "setItems"]);
    const baseItems = data?.baseItems;
    const uniqueItems = data?.uniqueItems;
    const setItems = data?.setItems;
    const runes = data?.runes;

    const {
        data: grailProgress,
        isFetching: isFetchingGrailProgress,
        // error: grailProgressError,
    } = useGrailProgress();

    const isFetching = isFetchingItems || isFetchingGrailProgress;
    // const error = itemsError || grailProgressError;

    if (isFetching || !data || !grailProgress) {
        return null;
    }

    return (
        <div className="pt-4 pb-8 grid grid-cols-1 gap-4">
            {debouncedSearchString ? (
                <GrailItemList data={data as Items} />
            ) : (
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
            )}
        </div>
    );
}
