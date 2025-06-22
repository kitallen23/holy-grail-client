import { Link, Outlet } from "react-router";
import styles from "./Layout.module.scss";
import { Button } from "@/components/ui/button";

export default function Layout() {
    return (
        <>
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
                            <Link to="/">grail</Link>
                        </Button>
                        <Button
                            asChild
                            variant="link"
                            className="text-primary-foreground font-bold"
                            size="sm"
                        >
                            <Link to="/items">item index</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="pt-8 px-2 sm:px-4 mx-auto w-full max-w-4xl">
                <Outlet />
            </main>

            {/* <footer></footer> */}
        </>
    );
}
