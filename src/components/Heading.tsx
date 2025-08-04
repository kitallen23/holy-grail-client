import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLHeadingElement>;

export default function Heading({ className, children, ...props }: Props) {
    return (
        <h2
            {...props}
            className={cn(
                "text-2xl font-semibold tracking-tight pb-1 font-diablo text-center",
                className
            )}
        >
            {children}
        </h2>
    );
}
