import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useItems } from "@/hooks/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";
import { getSearchTerms, matchesAllTerms } from "@/lib/search";
import { getSearchableText } from "@/routes/items/-utils";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert, X } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/items/")({
    component: ItemsPage,
});

function ItemsPage() {
    const { data, isFetching, error } = useItems();

    const [searchString, setSearchString] = useState("");
    const debouncedSearchString = useDebounce(searchString, SEARCH_DEBOUNCE_DELAY);

    const displayedItems = useMemo(() => {
        if (!data || !debouncedSearchString.trim()) {
            return data;
        }

        const searchTerms = getSearchTerms(debouncedSearchString);
        if (searchTerms.length === 0) {
            return data;
        }

        const filtered: typeof data = {
            uniqueItems: {},
            setItems: {},
            runes: {},
        };

        Object.entries(data.uniqueItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered.uniqueItems[key] = item;
            }
        });
        Object.entries(data.setItems).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered.setItems[key] = item;
            }
        });
        Object.entries(data.runes).forEach(([key, item]) => {
            const searchableText = getSearchableText(item);
            if (matchesAllTerms(searchableText, searchTerms)) {
                filtered.runes[key] = item;
            }
        });

        return filtered;
    }, [data, debouncedSearchString]);

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
        return null;
    }

    return (
        <div className="pt-4 grid grid-cols-1 gap-4">
            <div className="max-w-96 m-auto w-full grid grid-cols-[1fr_auto] gap-2">
                <div className="relative">
                    <Input
                        value={searchString}
                        onChange={event => setSearchString(event.target.value)}
                        placeholder="Search..."
                        type="search"
                    />
                    {searchString && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-current/60 hover:text-current"
                            onClick={() => {
                                setSearchString("");
                            }}
                        >
                            <X />
                            <span className="sr-only">Clear</span>
                        </Button>
                    )}
                </div>
            </div>
            <div className="grid gap-4"></div>
        </div>
    );
}
