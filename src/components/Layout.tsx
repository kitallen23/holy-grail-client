import { Link, Outlet } from "react-router";
import styles from "./Layout.module.scss";
import { Button } from "@/components/ui/button";

export default function Layout() {
    return (
        <>
            <header
                className={`${styles.header} h-8 bg-primary text-primary-foreground flex items-center justify-between fixed top-0 right-0 w-full flex-nowrap`}
            >
                <div className="flex gap-4 items-center flex-nowrap">
                    <div
                        className={`${styles.title} text-lg flex items-center text-primary-foreground px-2 flex-nowrap`}
                    >
                        Holy Grail
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
                            <Link to="/">item index</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="pt-8">
                <Outlet />
            </main>

            {/* <footer></footer> */}
        </>
    );
}
