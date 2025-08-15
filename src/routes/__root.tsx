import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/LoginModal";
import { Toaster } from "@/components/ui/sonner";
import ItemDialog from "@/components/ItemTooltip/ItemDialog";

import { useSearchBar, useSearchDebounceManager } from "@/stores/useSearchStore";
import { useGrailData } from "@/hooks/useGrailData";
import { useAnalytics } from "@/hooks/useAnalytics";
import { APP_TITLE } from "@/lib/constants";
import { useAuthStore } from "@/stores/useAuthStore";
import { LoaderCircleIcon } from "lucide-react";

// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const RootLayout = () => {
    const { isVisible } = useSearchBar();
    const { isLoggingOut } = useAuthStore();
    useSearchDebounceManager();
    useGrailData();
    useAnalytics();

    return (
        <>
            <HeadContent />

            <div className="min-h-dvh flex flex-col">
                <Header hideSearch={isLoggingOut} />
                <main
                    className={`px-2 sm:px-4 mx-auto w-full max-w-4xl ${isVisible ? "pt-21" : "pt-8"} flex-1`}
                >
                    {isLoggingOut ? (
                        <>
                            <div className="flex justify-center">
                                <LoaderCircleIcon className="animate-spin" size="2em" />
                            </div>
                        </>
                    ) : (
                        <>
                            <Outlet />
                            <LoginModal />
                            <ItemDialog />
                        </>
                    )}
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
