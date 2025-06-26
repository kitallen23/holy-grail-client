import { Button } from "@/components/ui/button";
import styles from "./Header.module.scss";
import { Link } from "@tanstack/react-router";

export default function Header() {
    return (
        <header
            className={`${styles.header} h-8 bg-primary text-primary-foreground flex items-center justify-between fixed top-0 right-0 w-full flex-nowrap`}
        >
            <div className="flex gap-4 items-center flex-nowrap mx-auto max-w-4xl w-full px-2 sm:px-4">
                <div
                    className={`${styles.title} text-lg flex items-center text-primary-foreground flex-nowrap`}
                >
                    HOLY GRAIL
                </div>

                <nav>
                    <Button
                        asChild
                        variant="link"
                        className="text-primary-foreground font-bold"
                        size="sm"
                    >
                        <Link to="/">Grail</Link>
                    </Button>
                    <Button
                        asChild
                        variant="link"
                        className="text-primary-foreground font-bold"
                        size="sm"
                    >
                        <Link to="/items">Item Index</Link>
                    </Button>
                    <Button
                        asChild
                        variant="link"
                        className="text-primary-foreground font-bold"
                        size="sm"
                    >
                        <Link to="/runewords">Runewords</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
