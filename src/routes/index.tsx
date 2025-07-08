import { createFileRoute } from "@tanstack/react-router";
import { useGrailProgress, useItems } from "@/hooks/queries";
import GrailStatsTable from "./-grail/GrailStatsTable";
import GrailRemainingItemSummary from "./-grail/GrailRemainingItemSummary";

export const Route = createFileRoute("/")({
    component: GrailPage,
});

function GrailPage() {
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
        <div className="pt-2 pb-8 grid grid-cols-1 gap-4">
            <div className="grid max-w-lg mx-auto w-full">
                <h2 className="text-2xl font-semibold tracking-tight pb-1 text-destructive font-diablo text-center">
                    Statistics
                </h2>
                <GrailStatsTable
                    uniqueItems={uniqueItems!}
                    setItems={setItems!}
                    runes={runes!}
                    grailProgress={grailProgress}
                />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight pb-1 text-destructive font-diablo text-center mt-4">
                Remaining Grail Items
            </h2>
            <GrailRemainingItemSummary
                uniqueItems={uniqueItems!}
                setItems={setItems!}
                baseItems={baseItems!}
                grailProgress={grailProgress}
            />
        </div>
    );
}
