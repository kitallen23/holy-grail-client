import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import type { Runeword } from "@/types/items";
import ItemAffix from "@/components/ItemTooltip/ItemAffix";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface RunewordDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    runeword?: Runeword;
}

export default function RunewordDialog({ runeword, ...props }: RunewordDialogProps) {
    return (
        <Dialog {...props}>
            <DialogTitle className="sr-only">{runeword?.name || "Item"} Tooltip</DialogTitle>
            {runeword ? (
                <DialogContent
                    className="bg-black/90 rounded-none border-none p-3 w-[max-content] max-h-[calc(100dvh-2rem)] overflow-y-auto"
                    aria-describedby={undefined}
                >
                    <div className="max-w-3xl font-diablo text-md sm:text-xl flex gap-y-1 flex-col text-center leading-6">
                        <div className="text-primary">{runeword.name}</div>
                        <div className="text-muted-foreground">{runeword.itemTypes.join(", ")}</div>
                        <div className="text-primary">&apos;{runeword.runes.join("")}&apos;</div>
                        {runeword.implicits?.map((implicit, i) => (
                            <ItemAffix
                                key={i}
                                affix={implicit}
                                color="text-foreground"
                                variableColor="text-diablo-blue"
                            />
                        )) || null}
                        {runeword.affixes.map((affix, i) => (
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
