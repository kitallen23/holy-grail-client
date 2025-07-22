import clsx from "clsx";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGrailItem } from "@/hooks/useGrailItem";

type Props<T> = Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "onClick"> & {
    name: string;
    uniqueName: string;
    subtext?: string;
    isSelected: boolean;
    selectedColor?: string;
    imageSrc?: string;
    data: T;
    onClick?: (data: T) => void;
};

export default function CheckboxItem<T>({
    name,
    uniqueName,
    subtext,
    isSelected,
    imageSrc,
    data,
    onClick,
    ...props
}: Props<T>) {
    const { found, setFound } = useGrailItem(uniqueName);

    return (
        <label className="inline-grid gap-2 grid-cols-[auto_1fr] items-center w-fit">
            <Checkbox {...props} checked={found} onCheckedChange={setFound} />
            <Button
                key={uniqueName}
                variant="ghost"
                size="sm"
                className={clsx(
                    "item-trigger justify-start border border-transparent inline-flex max-w-full min-w-0 pl-1",
                    isSelected ? "border-primary" : ""
                )}
                onClick={() => onClick?.(data)}
                aria-haspopup="dialog"
                aria-label={`View details for ${name}`}
            >
                {imageSrc ? <img src={imageSrc} className="h-[2em]" /> : null}
                <div className="text-nowrap truncate">{uniqueName}</div>
                {subtext ? (
                    <div className="pl-0 sm:pl-1 text-foreground/60 truncate">{subtext}</div>
                ) : null}
            </Button>
        </label>
    );
}
