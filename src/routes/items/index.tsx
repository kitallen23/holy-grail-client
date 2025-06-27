import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/items/")({
    beforeLoad: () => {
        // Redirect /items to /items/unique
        throw redirect({ to: "/items/unique" });
    },
    component: RouteComponent,
});

function RouteComponent() {
    return null;
}
