import { useState, useEffect } from "react";

interface NavigatorStandalone extends Navigator {
    standalone?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if app is already running as PWA
        const checkIfInstalled = () => {
            return (
                window.matchMedia("(display-mode: standalone)").matches ||
                (window.navigator as NavigatorStandalone).standalone === true
            );
        };

        setIsInstalled(checkIfInstalled());

        // Capture install prompt (but don't prevent default)
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            setDeferredPrompt(e);
        };

        // Listen for successful install
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt as EventListener
            );
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const isPWACapable = () => {
        // iOS devices can install PWAs via "Add to Home Screen"
        // BUT Firefox iOS doesn't support this
        if (/iPhone|iPad/.test(navigator.userAgent)) {
            return true;
        }

        // Desktop/Android browsers need service worker + install API
        return "serviceWorker" in navigator && "BeforeInstallPromptEvent" in window;
    };

    const installApp = async (): Promise<"success" | "failed" | "unavailable"> => {
        if (!deferredPrompt) {
            return "unavailable";
        }

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            setDeferredPrompt(null);

            return outcome === "accepted" ? "success" : "failed";
        } catch (error) {
            console.error("Install failed:", error);
            return "failed";
        }
    };

    return {
        shouldShowButton: !isInstalled && isPWACapable(),
        isInstalled,
        installApp,
        hasNativePrompt: !!deferredPrompt,
    };
}

export const getInstallInstructions = () => {
    const userAgent = navigator.userAgent;

    // All iOS browsers (except Firefox) use "Add to Home Screen"
    if (/iPhone|iPad/.test(userAgent) && !/Firefox/.test(userAgent)) {
        return "To install: Tap Share → Add to Home Screen";
    }

    // Desktop/Android Chrome-based browsers
    if (/Chrome|Edg/.test(userAgent)) {
        return "To install: Look for the install button in your address bar";
    }

    // Generic fallback
    return "To install: Look for install options in your browser menu";
};
