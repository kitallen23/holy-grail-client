import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import Header from "@/components/layout/Header";
import { useSearchBar, useSearchDebounceManager } from "@/stores/useSearchStore";
import LoginModal from "@/components/LoginModal";
import { Toaster } from "@/components/ui/sonner";
import ItemDialog from "@/components/ItemTooltip/ItemDialog";
import { APP_TITLE } from "@/lib/constants";

// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const RootLayout = () => {
    const { isVisible } = useSearchBar();
    useSearchDebounceManager();

    return (
        <>
            <HeadContent />
            <Header />
            <main
                className={`px-2 sm:px-4 mx-auto w-full max-w-4xl h-dvh ${isVisible ? "pt-21" : "pt-8"}`}
            >
                <Outlet />
                <LoginModal />
                <ItemDialog />
            </main>
            <Toaster />
            {/* <footer></footer> */}

            {/* <TanStackRouterDevtools /> */}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </>
    );
};

export const Route = createRootRoute({
    component: RootLayout,
    head: () => ({
        meta: [
            {
                name: "Holy Grail",
                content: "Diablo 2 Holy Grail item tracker",
            },
            {
                title: APP_TITLE,
            },
        ],
    }),
});
