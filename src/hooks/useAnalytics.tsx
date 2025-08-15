import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const useAnalytics = () => {
    const { pathname } = useLocation();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (import.meta.env.MODE === "development") {
            return;
        }
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://a.chuggs.net/x";
        script.setAttribute("data-website-id", "1d4dc1ba-9417-4190-8b23-993ee5267fcf");
        script.setAttribute("data-auto-track", "false");
        script.onload = () => setIsReady(true);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (import.meta.env.MODE === "development") {
            return;
        }
        if (isReady && window.umami) {
            window.umami.track((props: UmamiTrackingProperties) => ({ ...props, url: pathname }));
        }
    }, [pathname, isReady]);

    return null;
};

export function trackEvent(eventName: string, data?: object) {
    if (import.meta.env.MODE === "development") {
        return;
    }
    if (window.umami) {
        window.umami.track(eventName, data);
    }
}
