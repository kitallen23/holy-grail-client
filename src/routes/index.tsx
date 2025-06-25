import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <div>
            <div className="font-bold">Hello, World!</div>
            <div className="flex gap-4">
                <Button>
                    <div className="flex flex-nowrap gap-x-1 items-center">
                        <Check size={64} />
                        primary
                    </div>
                </Button>
                <Button variant="secondary">secondary</Button>
                <Button variant="accent">accent</Button>
                <Button variant="outline">outline</Button>
                <Button variant="ghost">ghost</Button>
                <Button size="icon">
                    <Check />
                </Button>
            </div>
            <div className="text-lg">This is a test of the new font.</div>
            <div className="text-xl">abcdefghijklmnopqrstuvwxyz</div>
            <div className="text-xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
            <div className="text-xl">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien
                vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
                Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec
                metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.
                Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia
                nostra inceptos himenaeos.
            </div>
        </div>
    );
}
