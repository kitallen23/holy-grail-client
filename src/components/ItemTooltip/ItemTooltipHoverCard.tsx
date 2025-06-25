import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { HoverCardContent } from "@/components/ui/hover-card";

export default function ItemTooltipHoverCard({
    children,
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
    return (
        <HoverCardContent className="bg-black/90 rounded-none border-none min-w-0 w-auto p-3 font-diablo text-xl max-w-lg flex gap-y-0.5 flex-col text-center pointer-events-none">
            {children}
        </HoverCardContent>
    );
}
