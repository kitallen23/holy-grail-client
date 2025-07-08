import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { BaseItem, SetItem } from "@/types/items";
import type { WithKey } from "@/routes/items/-types";
import CheckboxItem from "@/components/CheckboxItem";

interface Props extends React.ComponentProps<typeof DialogPrimitive.Root> {
    base?: Partial<WithKey<BaseItem>>;
    foundSetItems?: WithKey<SetItem>[];
    notFoundSetItems?: WithKey<SetItem>[];
    onClick: (item: WithKey<SetItem>) => void;
}

const GrailSetBaseDialog = React.forwardRef<React.ComponentRef<typeof DialogContent>, Props>(
    ({ base, notFoundSetItems, foundSetItems, onClick, ...props }, ref) => {
        const allSets = (notFoundSetItems || [])
            .concat(foundSetItems || [])
            .sort((a, b) => (a.key > b.key ? 1 : 0));
        return (
            <Dialog {...props}>
                {base ? (
                    <DialogContent
                        ref={ref}
                        className="w-[90vw] max-w-sm max-h-[calc(100dvh-2rem)] overflow-y-auto"
                        aria-describedby={undefined}
                    >
                        <DialogTitle className="font-diablo text-diablo-green font-normal text-xl">
                            {base.name} Set Items
                        </DialogTitle>
                        <div className="grid gap-1 overflow-hidden">
                            {(allSets || []).map(item => (
                                <CheckboxItem
                                    key={item.key}
                                    name={item.name}
                                    uniqueName={item.key}
                                    isSelected={false}
                                    data={item}
                                    onClick={onClick}
                                />
                            ))}
                        </div>
                    </DialogContent>
                ) : null}
            </Dialog>
        );
    }
);

GrailSetBaseDialog.displayName = "GrailSetBaseDialog";

export default GrailSetBaseDialog;
