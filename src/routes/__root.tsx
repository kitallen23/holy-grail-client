import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/LoginModal";
import { Toaster } from "@/components/ui/sonner";
import ItemDialog from "@/components/ItemTooltip/ItemDialog";

import { useSearchBar, useSearchDebounceManager } from "@/stores/useSearchStore";
import { useGrailData } from "@/hooks/useGrailData";
import { APP_TITLE } from "@/lib/constants";

// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const RootLayout = () => {
    const { isVisible } = useSearchBar();
    useSearchDebounceManager();

    useGrailData();

    return (
        <>
            <HeadContent />

            <div className="min-h-dvh flex flex-col">
                <Header />
                <main
                    className={`px-2 sm:px-4 mx-auto w-full max-w-4xl ${isVisible ? "pt-21" : "pt-8"} flex-1`}
                >
                    <Outlet />
                    <LoginModal />
                    <ItemDialog />
                </main>
                <Footer />
            </div>

            <Toaster />

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
                title: APP_TITLE,
            },
        ],
    }),
});
