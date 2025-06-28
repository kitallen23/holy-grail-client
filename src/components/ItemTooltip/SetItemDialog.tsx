import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import type { SetItem } from "@/types/items";
import ItemAffix from "@/components/ItemTooltip/ItemAffix";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SetItemBonusAffix from "@/components/ItemTooltip/SetItemBonusAffix";

interface SetItemDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    item?: SetItem;
}

export default function SetItemDialog({ item, ...props }: SetItemDialogProps) {
    const displayedItemBonuses = Object.entries(item?.itemBonuses || {}).sort((a, b) =>
        a[0] > b[0] ? 0 : 1
    );

    return (
        <Dialog {...props}>
            <DialogTitle className="sr-only">{item?.name || "Item"} Tooltip</DialogTitle>
            {item ? (
                <DialogContent
                    className="bg-black/90 rounded-none border-none p-3 w-[max-content] max-h-[calc(100dvh-2rem)] overflow-y-auto"
                    aria-describedby={undefined}
                >
                    <div className="max-w-3xl font-diablo text-md sm:text-xl flex gap-y-1 flex-col text-center leading-6">
                        <div className="text-diablo-green">{item.name}</div>
                        <div className="text-diablo-green">{item.type}</div>
                        {item.implicits?.map((implicit, i) => (
                            <ItemAffix
                                key={i}
                                affix={implicit}
                                color="text-foreground"
                                variableColor="text-diablo-blue"
                            />
                        )) || null}
                        {item.affixes.map((affix, i) => (
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
                                {itemName}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            ) : null}
        </Dialog>
    );
}
