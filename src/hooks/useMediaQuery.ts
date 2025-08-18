import { useEffect, useState } from "react";

const breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
} as const;

type Breakpoint = keyof typeof breakpoints;

function getMediaQuery(breakpoint: Breakpoint): string {
    return `(min-width: ${breakpoints[breakpoint]})`;
}

export function useMediaQuery(query: string): boolean;
export function useMediaQuery(breakpoint: Breakpoint): boolean;
export function useMediaQuery(input: string | Breakpoint): boolean {
    const [matches, setMatches] = useState(false);

    const query = input in breakpoints ? getMediaQuery(input as Breakpoint) : input;

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
}
