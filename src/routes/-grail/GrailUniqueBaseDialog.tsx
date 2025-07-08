import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { BaseItem, UniqueItem } from "@/types/items";
import type { WithKey } from "@/routes/items/-types";
import CheckboxItem from "@/components/CheckboxItem";

interface Props extends React.ComponentProps<typeof DialogPrimitive.Root> {
    base?: Partial<WithKey<BaseItem>>;
    foundUniqueItems?: WithKey<UniqueItem>[];
    notFoundUniqueItems?: WithKey<UniqueItem>[];
}

const GrailUniqueBaseDialog = React.forwardRef<React.ComponentRef<typeof DialogContent>, Props>(
    ({ base, notFoundUniqueItems, /*foundUniqueItems,*/ ...props }, ref) => {
        return (
            <Dialog {...props}>
                {base ? (
                    <DialogContent
                        ref={ref}
                        className="w-[90vw] max-w-xs max-h-[calc(100dvh-2rem)] overflow-y-auto"
                        aria-describedby={undefined}
                    >
                        <DialogTitle className="font-diablo text-primary font-normal text-xl">
                            {base.name} Unique Items
                        </DialogTitle>
                        <div className="grid gap-1 overflow-hidden">
                            {(notFoundUniqueItems || []).map(item => (
                                <CheckboxItem
                                    key={item.key}
                                    name={item.name}
                                    uniqueName={item.key}
                                    isSelected={false}
                                    data={item}
                                    // checked={false}
                                    // subtext="Hello, world! Here's a bunch of text."
                                />
                            ))}
                        </div>
                    </DialogContent>
                ) : null}
            </Dialog>
        );
    }
);

GrailUniqueBaseDialog.displayName = "GrailUniqueBaseDialog";

export default GrailUniqueBaseDialog;
