import { APP_VERSION } from "@/lib/constants";
import styles from "./Footer.module.scss";
import GithubIcon from "@/components/GithubIcon";
import { Button } from "../ui/button";

function Footer() {
    return (
        <footer
            className={`${styles.footer} bg-background h-6 border-t border-border/50 px-2 sm:px-4`}
        >
            <div className="max-w-4xl mx-auto flex gap-4 justify-end items-center">
                <div className="text-muted-foreground/75 text-xs font-formal">v{APP_VERSION}</div>
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
        </footer>
    );
}

export default Footer;
