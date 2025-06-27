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

export const Route = createFileRoute("/items/sets/")({
    component: SetItemsPage,
});

const TIERS: Tier[] = ["Normal", "Exceptional", "Elite"];

function SetItemsPage() {
    const { data, isFetching, error } = useItems("sets");
    // TODO: Replace this
    const debouncedSearchString = "";

    const displayedItems: Record<string, SetItem> | undefined = useMemo(() => {
        if (!data || !debouncedSearchString.trim()) {
            return data as Record<string, SetItem>;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        if (searchTerms.length === 0) {
            return data as Record<string, SetItem>;
        }

        const filtered: Record<string, SetItem> = {};

        Object.entries(data.setItems).forEach(([key, item]) => {
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
        // TODO: Replace this with a skeleton
        return null;
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
                {/* <div className="grid md:grid-cols-2 gap-4">
                    {SETS.map(({ name }) => (
                        <SetCategory
                            key={name}
                            data={displayedItems}
                            set={name}
                            label={name}
                            selectedItem={selectedItem}
                            onClick={item => setSelectedItem(item ? item : null)}
                        />
                    ))}
                </div> */}
            </div>
            <SetItemDialog
                open={!!selectedItem}
                onOpenChange={open => !open && setSelectedItem(null)}
                item={selectedItem as SetItem}
            />
        </>
    );
}
