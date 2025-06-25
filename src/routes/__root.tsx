import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "@/components/layout/Header";

export const Route = createRootRoute({
    component: () => (
        <>
            <Header />

            <main className="pt-8 px-2 sm:px-4 mx-auto w-full max-w-4xl">
                <Outlet />
            </main>

            {/* <footer></footer> */}
            <TanStackRouterDevtools />
        </>
    ),
});
