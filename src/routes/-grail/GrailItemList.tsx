import type { Rune, SetItem, UniqueItem } from "@/types/items";
import UniqueItems from "@/routes/-grail/unique/UniqueItems";
import SetItems from "@/routes/-grail/sets/SetItems";
import Runes from "@/routes/-grail/runes/Runes";
import { useDebouncedSearch, useSearchFilters } from "@/stores/useSearchStore";
import { Button } from "@/components/ui/button";
import { useShowItemList } from "@/hooks/useShowItemList";

type Props = {
    data: {
        uniqueItems: Record<string, UniqueItem>;
        setItems: Record<string, SetItem>;
        runes: Record<string, Rune>;
    };
};

export default function GrailSearchResults({ data }: Props) {
    const { clearSearch } = useDebouncedSearch();
    const { clearFilters } = useSearchFilters();
    const { itemCount } = useShowItemList();

    const showClearButton = itemCount === 0;

    return (
        <div className="grid grid-cols-1 gap-4">
            <UniqueItems uniqueItems={data.uniqueItems} />
            <SetItems setItems={data.setItems} />
            <Runes runes={data.runes} />
            {showClearButton ? (
                <div className="mt-4 flex flex-col gap-2">
                    <div className="text-center text-muted-foreground italic">No items found.</div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground self-center"
                        onClick={() => {
                            clearSearch();
                            clearFilters();
                        }}
                    >
                        Clear filter
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
