import { APP_VERSION } from "@/lib/constants";
import styles from "./Footer.module.scss";
import GithubIcon from "@/components/GithubIcon";
import { Button } from "../ui/button";
import { MonitorDownIcon } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { toast } from "sonner";

const getInstallInstructions = () => {
    const userAgent = navigator.userAgent;

    // iOS Safari
    if (/iPhone|iPad/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
        return "To install: Tap Share → Add to Home Screen";
    }

    // Desktop/Android Chrome-based (Chrome, Edge, Samsung, etc.)
    if (/Chrome|Edg/.test(userAgent)) {
        return "To install: Look for the install button in your address bar";
    }

    // Generic fallback
    return "To install: Look for install options in your browser menu";
};

function Footer() {
    const { shouldShowButton, installApp } = usePWAInstall();

    const onInstallClick = async () => {
        const result = await installApp();
        if (result === "success") {
            toast.success("App installed successfully!");
        } else {
            toast.info(getInstallInstructions());
        }
    };

    return (
        <footer
            className={`${styles.footer} bg-background h-6 border-t border-border/50 px-2 sm:px-4`}
        >
            <div className="max-w-4xl mx-auto flex gap-4 justify-between items-center">
                <div>
                    {shouldShowButton ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1 font-formal text-muted-foreground/75 text-xs"
                            onClick={onInstallClick}
                        >
                            <MonitorDownIcon className="size-3.5" />
                            Install App
                        </Button>
                    ) : null}
                </div>
                <div className="flex justify-end items-center gap-4">
                    <div className="text-muted-foreground/75 text-xs font-formal">
                        v{APP_VERSION}
                    </div>
                    <div className="text-muted-foreground/75 text-xs font-formal">
                        © 2025 kitallen23
                    </div>
                    <div className="text-muted-foreground/75 text-xs">
                        <Button variant="ghost" size="icon" className="size-5" asChild>
                            <a
                                href="https://github.com/kitallen23/holy-grail-client"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View on GitHub"
                                className="text-xl"
                            >
                                <GithubIcon className="size-3.5" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
