import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { BaseItem, UniqueItem } from "@/types/items";
import type { WithKey } from "@/routes/items/-types";

interface Props extends React.ComponentProps<typeof DialogPrimitive.Root> {
    base?: Partial<WithKey<BaseItem>>;
    foundUniqueItems?: WithKey<UniqueItem>[];
    notFoundUniqueItems?: WithKey<UniqueItem>[];
}

export default function GrailUniqueBaseDialog({ base, ...props }: Props) {
    return (
        <Dialog {...props}>
            {base ? (
                <DialogContent
                    className="bg-black/90 rounded-none border-none p-3 w-[max-content] max-h-[calc(100dvh-2rem)] overflow-y-auto"
                    aria-describedby={undefined}
                >
                    <DialogTitle>{base.name}</DialogTitle>
                    Placeholder
                </DialogContent>
            ) : null}
        </Dialog>
    );
}
