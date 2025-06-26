import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import type { UniqueItem } from "@/types/items";
import ItemAffix from "@/components/ItemTooltip/ItemAffix";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface UniqueItemDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    item?: UniqueItem;
}

export default function UniqueItemDialog({ item, ...props }: UniqueItemDialogProps) {
    return (
        <Dialog {...props}>
            <DialogTitle className="sr-only">{item?.name || "Item"} Tooltip</DialogTitle>
            {item ? (
                <DialogContent
                    className="bg-black/90 rounded-none border-none p-3 w-[max-content]"
                    onOpenAutoFocus={e => e.preventDefault()}
                    aria-describedby={undefined}
                >
                    <div className="max-w-3xl font-diablo text-xl flex gap-y-1 flex-col text-center leading-6">
                        <div className="text-primary">{item.name}</div>
                        <div className="text-muted-foreground">{item.type}</div>
                        {item.implicits?.map((implicit, i) => (
                            <ItemAffix
                                key={i}
                                affix={implicit}
                                color="text-white"
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
                    </div>
                </DialogContent>
            ) : null}
        </Dialog>
    );
}
