import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items/sets/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Set items placeholder</div>;
}
