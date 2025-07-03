import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "@/components/layout/Header";
import { useSearchBar } from "@/stores/useSearchStore";
import LoginModal from "@/components/LoginModal";
import { Toaster } from "@/components/ui/sonner";

const RootLayout = () => {
    const { isVisible } = useSearchBar();

    return (
        <>
            <Header />
            <main
                className={`px-2 sm:px-4 mx-auto w-full max-w-4xl h-dvh ${isVisible ? "pt-21" : "pt-8"}`}
            >
                <Outlet />
                <LoginModal />
            </main>
            <Toaster />
            {/* <footer></footer> */}
            {/* <TanStackRouterDevtools /> */}
        </>
    );
};

export const Route = createRootRoute({
    component: RootLayout,
});
