import type { GrailProgressItem } from "@/lib/api";
import type { BaseItem, Rune, SetItem, UniqueItem } from "@/types/items";
import { useEffect } from "react";
import { getRemainingUniqueBases } from "./utils";

type Props = {
    uniqueItems: Record<string, UniqueItem>;
    setItems: Record<string, SetItem>;
    runes: Record<string, Rune>;
    baseItems: Record<string, BaseItem>;
    grailProgress: Record<string, GrailProgressItem>;
};

export default function GrailRemainingItemSummary({
    uniqueItems,
    setItems,
    runes,
    baseItems,
    grailProgress,
}: Props) {
    // TODO: Remove me
    useEffect(() => {
        console.info("setItems, runes: ", setItems, runes);
    }, [uniqueItems, setItems, runes, baseItems, grailProgress]);

    const remainingUniqueBases = getRemainingUniqueBases(uniqueItems, baseItems, grailProgress);
    console.info(`remainingUniqueBases: `, remainingUniqueBases);
    return <div>Placeholder (item list goes here)</div>;
}
