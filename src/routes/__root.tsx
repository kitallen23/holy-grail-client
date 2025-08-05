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
                name: "description",
                content: "Diablo 2 Holy Grail item tracker",
            },
            {
                title: APP_TITLE,
            },

            // OpenGraph config
            { property: "og:type", content: "website" },
            { property: "og:site_name", content: "Holy Grail" },
            { property: "og:title", content: "Holy Grail - Diablo 2 Item Tracker" },
            {
                property: "og:description",
                content:
                    "Track your Diablo 2 Holy Grail progress. Find and collect unique items, set items, and runes.",
            },
            { property: "og:url", content: "https://holy-grail.chuggs.net" },
            { property: "og:image", content: "https://holy-grail.chuggs.net/og-image.png" },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { property: "og:image:alt", content: "Holy Grail - Diablo 2 Item Tracker" },

            // OG Twitter Card tags
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: "Holy Grail - Diablo 2 Item Tracker" },
            {
                name: "twitter:description",
                content:
                    "Track your Diablo 2 Holy Grail progress. Find and collect unique items, set items, and runes.",
            },
            { name: "twitter:image", content: "https://holy-grail.chuggs.net/og-image.png" },
        ],
    }),
});
