import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSearchString, useSearchFilters } from "@/stores/useSearchStore";
import { FilterIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";

export default function Searchbar() {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { searchString, setSearchString, clearSearch } = useSearchString();
    const { currentPageFilters, selectedFilters, setFilterValue } = useSearchFilters();

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

    const handleClearSearch = () => {
        clearSearch();
        searchInputRef.current?.focus();
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setSearchString("");
        } else if (e.key === "Enter") {
            e.currentTarget.blur();
        }
    };

    const hasActiveFilters = Object.values(selectedFilters).some(val => val);

    return (
        <div
            className={`max-w-96 m-auto w-full grid ${currentPageFilters ? "grid-cols-[1fr_auto]" : "grid-cols-1"} gap-2 px-2`}
        >
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
                    onFocus={e => e.target.select()}
                />
                {searchString && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-current/60 hover:text-current"
                        onClick={handleClearSearch}
                    >
                        <XIcon />
                        <span className="sr-only">Clear</span>
                    </Button>
                )}
            </div>
            {currentPageFilters?.length ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={hasActiveFilters ? "default" : "outline"} size="icon">
                            <FilterIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-49">
                        {currentPageFilters.map(filter => (
                            <React.Fragment key={filter.id}>
                                {filter.label ? (
                                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                                        {filter.label}
                                    </DropdownMenuLabel>
                                ) : null}
                                {filter.options.map(option => (
                                    <DropdownMenuCheckboxItem
                                        key={option.id}
                                        checked={selectedFilters[option.id] === true}
                                        onCheckedChange={checked =>
                                            setFilterValue(option.id, checked)
                                        }
                                        onSelect={event => event.preventDefault()}
                                    >
                                        {option.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </React.Fragment>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : null}
        </div>
    );
}
