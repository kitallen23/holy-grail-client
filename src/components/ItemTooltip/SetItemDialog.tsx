import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import type { SetItem } from "@/types/items";
import ItemAffix from "@/components/ItemTooltip/ItemAffix";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SetItemBonusAffix from "@/components/ItemTooltip/SetItemBonusAffix";
import clsx from "clsx";
import { useAuth } from "@/hooks/useAuth";
import GrailIndicator from "./GrailIndicator";
import type { WithKey } from "@/routes/items/-types";

const EXCLUDED_BASES = ["Amulet", "Ring"];

interface SetItemDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    item?: WithKey<SetItem>;
    onBaseItemClick: (itemName: string) => void;
    onSetItemClick: (itemName: string) => void;
}

const SetItemDialog = React.forwardRef<
    React.ComponentRef<typeof DialogContent>,
    SetItemDialogProps
>(({ item, onSetItemClick, onBaseItemClick, ...props }, ref) => {
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const displayedItemBonuses = Object.entries(item?.itemBonuses || {}).sort((a, b) =>
        a[0] > b[0] ? 0 : 1
    );

    return (
        <Dialog {...props}>
            {item ? (
                <DialogContent
                    ref={ref}
                    className="bg-black/90 rounded-none border-none p-3 w-[max-content] max-h-[calc(100dvh-2rem)] overflow-y-auto"
                    aria-describedby={undefined}
                >
                    <DialogTitle className="sr-only">{item?.name || "Item"} Tooltip</DialogTitle>
                    <div className="max-w-3xl font-diablo text-md sm:text-xl flex gap-y-1 flex-col text-center leading-6">
                        <div className="text-diablo-green">{item.name}</div>
                        {EXCLUDED_BASES.includes(item.type) ? (
                            <div className="text-diablo-green">{item.type}</div>
                        ) : (
                            <div className="text-diablo-green break-keep wrap-anywhere">
                                <button
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-diablo-green/20 text-diablo-green px-2 cursor-default select-none"
                                    onClick={() => onBaseItemClick(item.type)}
                                    aria-label={`View details for ${item.type}`}
                                >
                                    {item.type}
                                </button>
                            </div>
                        )}
                        {item.implicits?.map((implicit, i) => (
                            <ItemAffix
                                key={i}
                                affix={implicit}
                                color="text-foreground"
                                variableColor="text-diablo-blue"
                            />
                        )) || null}
                        {(item.affixes || []).map((affix, i) => (
                            <ItemAffix
                                key={i}
                                affix={affix}
                                color="text-diablo-blue"
                                variableColor="text-destructive"
                            />
                        )) || null}
                        {displayedItemBonuses.map(([key, affix]) => (
                            <SetItemBonusAffix
                                key={key}
                                bonus={key}
                                affix={affix}
                                color="text-diablo-green"
                                variableColor="text-destructive"
                            />
                        )) || null}
                        <div className="h-4" />
                        {item.setBonuses.map((affix, i) => (
                            <ItemAffix
                                key={i}
                                affix={affix}
                                color="text-primary"
                                variableColor="text-destructive"
                            />
                        )) || null}
                        <div className="h-4" />
                        <div className="text-primary break-keep wrap-anywhere">{item.category}</div>
                        {item.setItems.map(itemName => (
                            <div
                                key={itemName}
                                className="text-diablo-green break-keep wrap-anywhere"
                            >
                                <button
                                    className={clsx(
                                        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-diablo-green/20 text-diablo-green px-2 cursor-default select-none",
                                        itemName === item.name
                                            ? "relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:translate-x-1/2 after:-translate-y-1/2 after:w-1 after:h-1 after:bg-destructive after:rotate-45 after:shadow-[0_0_0_1px_background] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-destructive before:rotate-45 before:shadow-[0_0_0_1px_background]"
                                            : ""
                                    )}
                                    onClick={() => onSetItemClick(itemName)}
                                    aria-label={`View details for ${itemName}`}
                                >
                                    {itemName}
                                </button>
                            </div>
                        ))}
                    </div>
                    {isLoggedIn ? <GrailIndicator itemKey={item?.key} /> : null}
                </DialogContent>
            ) : null}
        </Dialog>
    );
});

SetItemDialog.displayName = "SetItemDialog";

export default SetItemDialog;
