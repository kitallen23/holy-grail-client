import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => (
    <Sonner
        theme="dark"
        position="top-center"
        className="toaster group"
        style={
            {
                "--normal-bg": "var(--popover)",
                "--normal-text": "var(--popover-foreground)",
                "--normal-border": "var(--border)",
                "margin-top": "calc(var(--spacing) * 16)",
            } as React.CSSProperties
        }
        {...props}
    />
);

export { Toaster };
