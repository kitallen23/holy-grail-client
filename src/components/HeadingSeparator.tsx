import { Separator } from "@/components/ui/separator";
import type React from "react";

export default function HeadingSeparator({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center">
            <Separator className="flex-1 bg-primary/60" />
            <span className="px-4 text-xl font-diablo text-destructive">
                {children}
            </span>
            <Separator className="flex-1 bg-primary/60" />
        </div>
    );
}
