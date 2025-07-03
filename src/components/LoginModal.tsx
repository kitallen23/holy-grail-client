import DiscordIcon from "@/components/DiscordIcon";
import GoogleIcon from "@/components/GoogleIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLoginModalStore } from "@/stores/useLoginModalStore";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

export const LoginModal = React.forwardRef<
    React.ComponentRef<typeof DialogContent>,
    React.ComponentProps<typeof DialogPrimitive.Root>
>(({ ...props }, ref) => {
    const { open, onOpenChange } = useLoginModalStore();

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    const handleDiscordLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
    };

    return (
        <Dialog {...props} open={open} onOpenChange={onOpenChange}>
            <DialogContent ref={ref} className="w-[90vw] max-w-xs" aria-describedby={undefined}>
                <DialogHeader className="mb-4">
                    <DialogTitle>Sign In</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Button className="gap-2" onClick={handleDiscordLogin}>
                        <DiscordIcon />
                        Continue with Discord
                    </Button>
                    <Button className="gap-2" onClick={handleGoogleLogin}>
                        <GoogleIcon />
                        Continue with Google
                    </Button>
                    <span className="text-muted-foreground text-sm">
                        Sign in to save your progress across devices.
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
});

LoginModal.displayName = "LoginModal";

export default LoginModal;
