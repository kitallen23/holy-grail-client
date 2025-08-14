import styles from "./Header.module.scss";
import { Link, useMatchRoute } from "@tanstack/react-router";
import Searchbar from "@/components/layout/Searchbar";
import { useDebouncedSearchString, useSearchBar } from "@/stores/useSearchStore";
import { useEffect, useState } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
    LoaderCircleIcon,
    LogInIcon,
    LogOutIcon,
    MenuIcon,
    SettingsIcon,
    UserIcon,
    XIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { useLoginModalStore } from "@/stores/useLoginModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import PentagramIcon from "@/components/PentagramIcon";

const NAV_ITEMS = [
    {
        label: "Grail",
        path: "/",
        fuzzy: false,
    },
    {
        label: "Item Index",
        path: "/items",
        fuzzy: true,
    },
    {
        label: "Unique Items",
        path: "/items/unique",
        fuzzy: false,
        isChild: true,
    },
    {
        label: "Set Items",
        path: "/items/sets",
        fuzzy: false,
        isChild: true,
    },
    {
        label: "Base Items",
        path: "/items/bases",
        fuzzy: false,
        isChild: true,
    },
    {
        label: "Runes",
        path: "/items/runes",
        fuzzy: false,
        isChild: true,
    },
    {
        label: "Runewords",
        path: "/runewords",
        fuzzy: false,
    },
];

type Props = {
    hideSearch: boolean;
};

export default function Header({ hideSearch }: Props) {
    const matchRoute = useMatchRoute();
    const { user, isLoading, logout } = useAuthStore();
    const { isVisible } = useSearchBar();
    const { debouncedSearchString } = useDebouncedSearchString();
    const { onOpenChange } = useLoginModalStore();

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [debouncedSearchString]);

    const currentPageName =
        NAV_ITEMS.find(item => matchRoute({ to: item.path, fuzzy: item.fuzzy }))?.label || "";

    return (
        <div className="relative">
            <header
                className={`${styles.header} h-8 bg-primary text-primary-foreground flex items-center justify-between fixed top-0 right-0 w-full flex-nowrap`}
            >
                <div className="flex gap-4 items-center flex-nowrap mx-auto max-w-4xl w-full px-2 sm:px-4 justify-between">
                    <div className="flex gap-4 items-center flex-nowrap w-full">
                        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <DropdownMenuTrigger
                                className="sm:hidden hover:text-primary-foreground h-6 hover:bg-background/10"
                                asChild
                            >
                                <Button variant="ghost" size="sm">
                                    {isMenuOpen ? <XIcon /> : <MenuIcon />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 m-1">
                                {NAV_ITEMS.map(item => {
                                    const isActiveRoute = !!matchRoute({
                                        to: item.path,
                                        fuzzy: false,
                                    });
                                    return (
                                        <DropdownMenuItem
                                            key={item.path}
                                            asChild
                                            className={clsx(
                                                "font-bold",
                                                {
                                                    "pl-8": item.isChild,
                                                },
                                                item.isChild ? "text-sm" : "text-md"
                                            )}
                                        >
                                            <Link
                                                to={item.path}
                                                data-active={isActiveRoute}
                                                onClick={() => window.scrollTo(0, 0)}
                                            >
                                                <div
                                                    className={clsx(
                                                        "w-1 h-1 rotate-45",
                                                        isActiveRoute
                                                            ? "bg-destructive"
                                                            : "bg-muted"
                                                    )}
                                                />
                                                {item.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div
                            className={`${styles.title} text-lg flex items-center text-primary-foreground flex-nowrap font-semibold gap-1 cursor-default`}
                        >
                            <PentagramIcon height="0.875em" />
                            HOLY GRAIL
                        </div>

                        {currentPageName ? (
                            <div className="sm:hidden font-bold">
                                <div className="py-0.5 px-1.5 w-fit bg-background/10 focus:bg-background/10 text-primary-foreground hover:text-primary-foreground focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:translate-y-1/2 after:w-1 after:h-1 after:bg-destructive after:rotate-45 after:shadow-[0_0_0_1px_background]">
                                    {currentPageName}
                                </div>
                            </div>
                        ) : null}

                        <nav className="hidden sm:block">
                            <NavigationMenu orientation="horizontal">
                                <NavigationMenuList className="">
                                    {NAV_ITEMS.map(item =>
                                        item.isChild ? null : (
                                            <NavigationMenuItem key={item.path}>
                                                <NavigationMenuLink
                                                    asChild
                                                    className="font-bold py-0.5 px-1.5 data-[active=true]:bg-background/10 data-[active=true]:focus:bg-background/10 data-[active=true]:hover:bg-background/10 hover:bg-background/10 focus:bg-background/10"
                                                    indicator
                                                >
                                                    <Link
                                                        to={item.path}
                                                        data-active={
                                                            !!matchRoute({
                                                                to: item.path,
                                                                fuzzy: item.fuzzy,
                                                            })
                                                        }
                                                        onClick={() => window.scrollTo(0, 0)}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        )
                                    )}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </nav>
                    </div>
                    {isLoading ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 opacity-50 hover:text-primary-foreground"
                        >
                            <LoaderCircleIcon size="16" className="animate-spin" />
                        </Button>
                    ) : user?.email ? (
                        <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                            <DropdownMenuTrigger
                                className={clsx(
                                    "hover:text-primary-foreground h-6 hover:bg-background/10",
                                    isUserMenuOpen ? "bg-background/10" : ""
                                )}
                                asChild
                            >
                                <Button variant="ghost" size="sm">
                                    <UserIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 m-1">
                                <DropdownMenuLabel>
                                    <div className="text-muted-foreground">Signed in as:</div>
                                    <div>{user.email}</div>
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link to="/settings">
                                        <SettingsIcon />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout}>
                                    <LogOutIcon />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-primary-foreground h-6 hover:bg-background/10"
                            onClick={() => onOpenChange(true)}
                        >
                            <LogInIcon size="16" />
                            <span className="hidden sm:block">Sign In</span>
                        </Button>
                    )}
                </div>
            </header>
            {isVisible && !hideSearch ? (
                <div
                    className={`${styles.searchbar} h-13 bg-background flex items-center justify-center fixed top-8 right-0 w-full flex-nowrap border-b`}
                >
                    <Searchbar />
                </div>
            ) : null}
        </div>
    );
}
