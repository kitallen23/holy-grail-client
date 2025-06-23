import HeadingSeparator from "@/components/HeadingSeparator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items")({
    component: Items,
});

function Items() {
    return (
        <div className="pt-4 grid gap-4 grid-cols-1">
            <HeadingSeparator>Armor</HeadingSeparator>
            <HeadingSeparator>Weapons</HeadingSeparator>
            <HeadingSeparator>Rings</HeadingSeparator>
            <HeadingSeparator>Amulets</HeadingSeparator>
            <HeadingSeparator>Charms</HeadingSeparator>
            <HeadingSeparator>Jewels</HeadingSeparator>
        </div>
    );
}
