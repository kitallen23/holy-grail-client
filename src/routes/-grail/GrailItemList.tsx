import type { BaseItem, Rune, SetItem, UniqueItem } from "@/types/items";
import UniqueItems from "@/routes/-grail/unique/UniqueItems";
import SetItems from "@/routes/-grail/sets/SetItems";

type Props = {
    data: {
        uniqueItems: Record<string, UniqueItem>;
        setItems: Record<string, SetItem>;
        runes: Record<string, Rune>;
        baseItems: Record<string, BaseItem>;
    };
};

export default function GrailSearchResults({ data }: Props) {
    return (
        <>
            <UniqueItems uniqueItems={data.uniqueItems} baseItems={data.baseItems} />
            <SetItems setItems={data.setItems} baseItems={data.baseItems} />
        </>
    );
}
