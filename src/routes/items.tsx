import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/items")({
    beforeLoad: ({ location }) => {
        // Redirect /items to /items/unique
        if (location.pathname === "/items") {
            throw redirect({ to: "/items/unique" });
        }
    },
    component: ItemsPage,
});

function ItemsPage() {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchString, setSearchString] = useState("");
    const debouncedSearchString = useDebounce(searchString, SEARCH_DEBOUNCE_DELAY);
    // TODO: Fix this / use this variable somewhere
    console.info(`debouncedSearchString: `, debouncedSearchString);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
                return;
            }

            // Forward slash (only if not typing in an input)
            if (
                e.key === "/" &&
                !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
            ) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        } else if (e.key === "Escape") {
            e.currentTarget.blur();
            setSearchString("");
        }
    };

    return (
        <>
            <div className="pt-4 pb-8 grid grid-cols-1 gap-4">
                <div className="max-w-96 m-auto w-full grid grid-cols-[1fr_auto] gap-2">
                    <div className="relative">
                        <Input
                            ref={searchInputRef}
                            value={searchString}
                            onChange={event => setSearchString(event.target.value)}
                            placeholder="Search..."
                            type="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            enterKeyHint="done"
                            onKeyDown={handleInputKeyDown}
                        />
                        {searchString && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-current/60 hover:text-current"
                                onClick={() => {
                                    setSearchString("");
                                }}
                            >
                                <XIcon />
                                <span className="sr-only">Clear</span>
                            </Button>
                        )}
                    </div>
                </div>
                <Outlet />
            </div>
        </>
    );
}
