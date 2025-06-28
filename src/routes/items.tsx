import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items")({
    component: ItemsPage,
});

function ItemsPage() {
    const matchRoute = useMatchRoute();

    return (
        <>
            <div className="pt-2 pb-8 grid grid-cols-1 gap-4">
                <div className="flex justify-center">
                    <NavigationMenu orientation="horizontal">
                        <NavigationMenuList className="bg-popover p-1 rounded-md border">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="py-1 px-1.5">
                                    <Link
                                        to="/items/unique"
                                        data-active={!!matchRoute({ to: "/items/unique" })}
                                    >
                                        Unique Items
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="py-1 px-1.5">
                                    <Link
                                        to="/items/sets"
                                        data-active={!!matchRoute({ to: "/items/sets" })}
                                    >
                                        Set Items
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="py-1 px-1.5">
                                    <Link
                                        to="/items/runes"
                                        data-active={!!matchRoute({ to: "/items/runes" })}
                                    >
                                        Runes
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <Outlet />
            </div>
        </>
    );
}
