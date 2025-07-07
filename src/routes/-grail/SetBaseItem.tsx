import { Button } from "@/components/ui/button";
import clsx from "clsx";
import type { SetBase } from "./utils";

type Props = {
    setBase: SetBase;
    selectedSetBase: SetBase | null;
    onClick: (setBase: SetBase) => void;
};

export default function SetBaseItem({ setBase, selectedSetBase, onClick }: Props) {
    const { base, setItems } = setBase;

    return (
        <Button
            key={base.name}
            variant="ghost"
            color="primary"
            size="sm"
            className={clsx(
                "item-trigger justify-start border border-transparent inline-flex w-fit max-w-full",
                base.name === selectedSetBase?.base.name ? "border-primary" : ""
            )}
            onClick={() => onClick(setBase)}
            aria-haspopup="dialog"
            aria-label={`View details for ${base.name}`}
        >
            <div className="text-nowrap truncate text-diablo-green">{base.name}</div>
            {setItems.length > 1 ? (
                <div className="pl-0 sm:pl-1 text-foreground/60 truncate">
                    {setItems.length} items
                </div>
            ) : null}
        </Button>
    );
}
