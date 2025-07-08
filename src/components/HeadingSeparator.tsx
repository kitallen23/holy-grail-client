import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type React from "react";

type Props = React.HTMLAttributes<HTMLHeadingElement>;

export default function HeadingSeparator({ className, children, ...props }: Props) {
    return (
        <div className="flex items-center">
            <Separator className="flex-1 bg-primary/60" />
            <h2
                {...props}
                className={cn(
                    "text-xl tracking-tight pb-1 font-diablo text-center text-destructive px-4",
                    className
                )}
            >
                {children}
            </h2>
            <Separator className="flex-1 bg-primary/60" />
        </div>
    );
}
