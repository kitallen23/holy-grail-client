import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges CSS class names with Tailwind CSS conflict resolution.
 *
 * Uses clsx for conditional class handling and tailwind-merge to resolve
 * conflicting Tailwind utilities (e.g., keeps 'p-4' when both 'p-2' and 'p-4' are present).
 *
 * @param inputs - Class names as strings, objects, arrays, or conditional expressions
 * @returns Merged and deduplicated class string
 *
 * @example
 * ```tsx
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': isActive })
 * // Returns: "px-4 py-2 bg-blue-500 text-white"
 *
 * cn('p-2 bg-red-500', 'p-4 bg-blue-500')
 * // Returns: "p-4 bg-blue-500" (conflicts resolved)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getRelativeText(date: string) {
    const itemFound = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - itemFound.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

    return `on ${itemFound.toLocaleDateString()} at ${itemFound.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
