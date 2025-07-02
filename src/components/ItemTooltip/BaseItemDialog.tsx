import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import type { BaseItem } from "@/types/items";
import ItemAffix from "@/components/ItemTooltip/ItemAffix";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import clsx from "clsx";

interface BaseItemDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    item?: BaseItem;
    onBaseItemClick: (itemName: string) => void;
}

export const BaseItemDialog = React.forwardRef<
    React.ComponentRef<typeof DialogContent>,
    BaseItemDialogProps
>(({ item, onBaseItemClick, ...props }: BaseItemDialogProps, ref) => {
    return (
        <Dialog {...props}>
            <DialogTitle className="sr-only">{item?.name || "Item"} Tooltip</DialogTitle>
            {item ? (
                <DialogContent
                    ref={ref}
                    className="bg-black/90 rounded-none border-none p-3 w-[max-content] max-h-[calc(100dvh-2rem)] overflow-y-auto"
                    aria-describedby={undefined}
                >
                    <div className="max-w-3xl font-diablo text-md sm:text-xl flex gap-y-1 flex-col text-center leading-6">
                        <div>{item.name}</div>
                        <div className="text-muted-foreground">{item.tier}</div>
                        {item.implicits?.map((implicit, i) => (
                            <ItemAffix
                                key={i}
                                affix={implicit}
                                color={
                                    implicit[0].toLowerCase().startsWith("base speed")
                                        ? "text-muted-foreground"
                                        : "text-foreground"
                                }
                                variableColor="text-diablo-blue"
                            />
                        )) || null}
                        {(item.affixes || []).map((affix, i) => (
                            <ItemAffix
                                key={i}
                                affix={affix}
                                color={
                                    affix[0].toLowerCase() === "or"
                                        ? "text-muted-foreground"
                                        : "text-diablo-blue"
                                }
                                variableColor="text-destructive"
                            />
                        )) || null}
                        <div className="h-4" />
                        <div className="text-primary break-keep wrap-anywhere">Variants</div>
                        {item.tierItems.map(tierItemName => (
                            <div
                                key={tierItemName}
                                className="text-foreground break-keep wrap-anywhere"
                            >
                                <button
                                    className={clsx(
                                        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-foreground/20 px-2 cursor-default select-none",
                                        tierItemName === item.name
                                            ? "text-muted-foreground"
                                            : "text-foreground",
                                        tierItemName === item.name
                                            ? "relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:translate-x-1/2 after:-translate-y-1/2 after:w-1 after:h-1 after:bg-destructive after:rotate-45 after:shadow-[0_0_0_1px_background] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-destructive before:rotate-45 before:shadow-[0_0_0_1px_background]"
                                            : ""
                                    )}
                                    onClick={() => onBaseItemClick(tierItemName)}
                                    aria-label={`View details for ${tierItemName}`}
                                >
                                    {tierItemName}
                                </button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            ) : null}
        </Dialog>
    );
});

BaseItemDialog.displayName = "BaseItemDialog";

export default BaseItemDialog;
