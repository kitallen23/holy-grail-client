import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useItems } from "@/hooks/queries";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import type { WithKey } from "@/routes/items/-types";
import { getSearchableText } from "@/routes/items/-utils";
import type { SetItem, Tier } from "@/types/items";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import SetItemDialog from "@/components/ItemTooltip/SetItemDialog";
import SetTier from "@/routes/items/sets/-SetTier";
import { useDebouncedSearch } from "@/stores/useSearchStore";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/items/sets/")({
    component: SetItemsPage,
});

const TIERS: Tier[] = ["Normal", "Exceptional", "Elite"];

function SetItemsPage() {
    const { data, isFetching, error } = useItems("sets");
    const { debouncedSearchString } = useDebouncedSearch();

    const displayedItems: Record<string, SetItem> | undefined = useMemo(() => {
        if (!data || !debouncedSearchString.trim()) {
            return data as Record<string, SetItem>;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        if (searchTerms.length === 0) {
            return data as Record<string, SetItem>;
        }

        const filtered: Record<string, SetItem> = {};

        Object.entries(data).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered[key] = item;
            }
        });

        return filtered;
    }, [data, debouncedSearchString]);

    const [selectedItem, setSelectedItem] = useState<WithKey<SetItem> | null>(null);

    if (error) {
        return (
            <div className="max-w-2xl mx-auto pt-4">
                <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Something went wrong when loading items. Please refresh the page or try
                        again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isFetching || !displayedItems) {
        return (
            <div className="grid grid-cols-1 gap-4 opacity-20">
                <div className="pb-1 flex justify-center items-center h-9">
                    <Skeleton className="w-24 h-6" />
                </div>
                <div className="flex items-center">
                    <Skeleton className="flex-1 h-[1px]" />
                    <span className="px-4 h-7 flex items-center">
                        <Skeleton className="w-14 h-4" />
                    </span>
                    <Skeleton className="flex-1 h-[1px]" />
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-32 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-24 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-36 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-20 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-44 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-24 h-4" />
                        </div>
                        <div className="h-8 flex items-center px-3">
                            <Skeleton className="w-28 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4">
                {TIERS.map(tier => (
                    <SetTier
                        key={tier}
                        data={displayedItems}
                        tier={tier}
                        selectedItem={selectedItem}
                        onClick={item => setSelectedItem(item || null)}
                    />
                ))}
            </div>
            <SetItemDialog
                open={!!selectedItem}
                onOpenChange={open => !open && setSelectedItem(null)}
                item={selectedItem as SetItem}
            />
        </>
    );
}
