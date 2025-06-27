import { Separator } from "@/components/ui/separator";
import type React from "react";

interface HeadingSeparatorProps extends React.PropsWithChildren {
    color?: string;
}

export default function HeadingSeparator({
    children,
    color = "text-destructive",
    ...rest
}: HeadingSeparatorProps) {
    return (
        <div {...rest} className="flex items-center">
            <Separator className="flex-1 bg-primary/60" />
            <span className={`px-4 text-xl font-diablo ${color}`}>{children}</span>
            <Separator className="flex-1 bg-primary/60" />
        </div>
    );
}
