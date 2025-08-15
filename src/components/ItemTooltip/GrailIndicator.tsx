import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useGrailItem } from "@/hooks/useGrailItem";
import { getRelativeText } from "@/lib/utils";
import { useLocation } from "@tanstack/react-router";

type Props = {
    itemKey: string;
};

const GrailIndicator = ({ itemKey }: Props) => {
    const { pathname } = useLocation();
    const { found, foundAt, setFound: _setFound } = useGrailItem(itemKey);
    const setFound = (value: boolean) => _setFound(value, pathname);

    const relativeText = getRelativeText(foundAt);

    return (
        <>
            <div className="flex items-center">
                <Separator className="flex-1 bg-primary/20" />
            </div>
            <label className="inline-grid gap-2 grid-cols-[auto_1fr] items-center w-fit mx-auto text-foreground/60">
                <Checkbox checked={found} onCheckedChange={setFound} />
                {found ? `Found ${relativeText}` : "Not found"}
            </label>
        </>
    );
};

export default GrailIndicator;
