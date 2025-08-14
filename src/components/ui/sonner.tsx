import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => (
    <Sonner
        theme="dark"
        position="top-right"
        className="toaster group"
        style={
            {
                "--normal-bg": "var(--popover)",
                "--normal-text": "var(--popover-foreground)",
                "--normal-border": "var(--border)",
                marginTop: "calc(var(--spacing) * 10)",
            } as React.CSSProperties
        }
        {...props}
    />
);

export { Toaster };
