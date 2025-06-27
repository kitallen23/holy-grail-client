import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items/runes/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Runes placeholder</div>;
}
