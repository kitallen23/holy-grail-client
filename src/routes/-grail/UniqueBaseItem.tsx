import { Button } from "@/components/ui/button";
import clsx from "clsx";
import type { UniqueBase } from "./utils";

type Props = {
    uniqueBase: UniqueBase;
    selectedUniqueBase: UniqueBase | null;
    onClick: (setBase: UniqueBase) => void;
};

export default function UniqueBaseItem({ uniqueBase, selectedUniqueBase, onClick }: Props) {
    const { base, uniqueItems } = uniqueBase;

    return (
        <Button
            key={base.name}
            variant="ghost"
            color="primary"
            size="sm"
            className={clsx(
                "item-trigger justify-start border border-transparent inline-flex w-fit max-w-full",
                base.name === selectedUniqueBase?.base.name ? "border-primary" : ""
            )}
            onClick={() => onClick(uniqueBase)}
            aria-haspopup="dialog"
            aria-label={`View details for ${base.name}`}
        >
            <div className="text-nowrap truncate text-primary">{base.name}</div>
            {uniqueItems.length > 1 ? (
                <div className="pl-0 sm:pl-1 text-foreground/60 truncate">
                    {uniqueItems.length} items
                </div>
            ) : null}
        </Button>
    );
}
