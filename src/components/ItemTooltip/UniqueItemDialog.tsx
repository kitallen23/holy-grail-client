import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import type { UniqueItem } from "@/types/items";
import ItemAffix from "@/components/ItemTooltip/ItemAffix";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const EXCLUDED_BASES = ["Amulet", "Ring", "Jewel", "Small Charm", "Large Charm", "Grand Charm"];

interface UniqueItemDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    item?: UniqueItem;
    onBaseItemClick: (itemName: string) => void;
}

export const UniqueItemDialog = React.forwardRef<
    React.ComponentRef<typeof DialogContent>,
    UniqueItemDialogProps
>(({ item, onBaseItemClick, ...props }, ref) => {
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
                        <div className="text-primary">{item.name}</div>
                        {EXCLUDED_BASES.includes(item.type) ? (
                            <div className="text-muted-foreground">{item.type}</div>
                        ) : (
                            <div className="text-muted-foreground break-keep wrap-anywhere">
                                <button
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-muted-foreground/20 text-muted-foreground px-2 cursor-default select-none"
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
                    </div>
                </DialogContent>
            ) : null}
        </Dialog>
    );
});

UniqueItemDialog.displayName = "UniqueItemDialog";

export default UniqueItemDialog;
