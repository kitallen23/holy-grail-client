import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import type { Rune } from "@/types/items";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface RuneDialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    rune?: Rune;
}

export default function RuneDialog({ rune, ...props }: RuneDialogProps) {
    return (
        <Dialog {...props}>
            <DialogTitle className="sr-only">{rune?.name || "Item"} Tooltip</DialogTitle>
            {rune ? (
                <DialogContent
                    className="bg-black/90 rounded-none border-none p-3 w-[max-content] max-h-[calc(100dvh-2rem)] overflow-y-auto"
                    aria-describedby={undefined}
                >
                    <div className="max-w-3xl font-diablo text-md sm:text-xl flex gap-y-1 flex-col text-center leading-6">
                        <div className="text-diablo-orange">{rune.name}</div>
                        <div>Can be Inserted into Socketed Items</div>
                        <div className="h-4" />
                        <div className="break-keep wrap-anywhere">
                            Weapons: {rune.implicits.Weapons}
                        </div>
                        <div className="break-keep wrap-anywhere">
                            Armor: {rune.implicits.Armor}
                        </div>
                        <div className="break-keep wrap-anywhere">
                            Helms: {rune.implicits.Helms}
                        </div>
                        <div className="break-keep wrap-anywhere">
                            Shields: {rune.implicits.Shields}
                        </div>
                        <div className="h-4" />
                        <div>Required Level: {rune.requiredLevel}</div>
                    </div>
                </DialogContent>
            ) : null}
        </Dialog>
    );
}
