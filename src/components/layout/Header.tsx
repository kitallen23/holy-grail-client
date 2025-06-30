import styles from "./Header.module.scss";
import { Link, useMatchRoute } from "@tanstack/react-router";
import Searchbar from "@/components/layout/Searchbar";
import { useDebouncedSearch, useSearchBar } from "@/stores/useSearchStore";
import { useEffect } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function Header() {
    const matchRoute = useMatchRoute();
    const { isVisible } = useSearchBar();
    const { debouncedSearchString } = useDebouncedSearch();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [debouncedSearchString]);

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
                        <NavigationMenu orientation="horizontal">
                            <NavigationMenuList className="">
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="py-0.5 px-1.5 data-[active=true]:bg-background/10 data-[active=true]:focus:bg-background/10 data-[active=true]:hover:bg-background/10 hover:bg-background/10 focus:bg-background/10"
                                    >
                                        <Link
                                            to="/"
                                            data-active={!!matchRoute({ to: "/" })}
                                            onClick={() => window.scrollTo(0, 0)}
                                            className="font-bold"
                                        >
                                            Grail
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="py-0.5 px-1.5 data-[active=true]:bg-background/10 data-[active=true]:focus:bg-background/10 data-[active=true]:hover:bg-background/10 hover:bg-background/10 focus:bg-background/10"
                                    >
                                        <Link
                                            to="/items"
                                            data-active={
                                                !!matchRoute({ to: "/items", fuzzy: true })
                                            }
                                            onClick={() => window.scrollTo(0, 0)}
                                            className="font-bold"
                                        >
                                            Item Index
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className="py-0.5 px-1.5 data-[active=true]:bg-background/10 data-[active=true]:focus:bg-background/10 data-[active=true]:hover:bg-background/10 hover:bg-background/10 focus:bg-background/10"
                                    >
                                        <Link
                                            to="/runewords"
                                            data-active={!!matchRoute({ to: "/runewords" })}
                                            className="font-bold"
                                        >
                                            Runewords
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>
                </div>
            </header>
            {isVisible ? (
                <div
                    className={`${styles.searchbar} h-13 bg-background flex items-center justify-center fixed top-8 right-0 w-full flex-nowrap border-b`}
                >
                    <Searchbar />
                </div>
            ) : null}
        </>
    );
}
