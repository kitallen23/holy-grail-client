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

    // Check if browser supports PWA installation
    const isPWACapable = () => {
        return (
            "serviceWorker" in navigator &&
            ("BeforeInstallPromptEvent" in window || /Chrome|Edg|Samsung/.test(navigator.userAgent))
        );
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
