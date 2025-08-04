import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLoginModalStore } from "@/stores/useLoginModalStore";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";
import LoginForm from "./LoginForm";

export const LoginModal = React.forwardRef<
    React.ComponentRef<typeof DialogContent>,
    React.ComponentProps<typeof DialogPrimitive.Root>
>(({ ...props }, ref) => {
    const { open, onOpenChange } = useLoginModalStore();

    return (
        <Dialog {...props} open={open} onOpenChange={onOpenChange}>
            <DialogContent ref={ref} className="w-[90vw] max-w-xs" aria-describedby={undefined}>
                <DialogHeader className="mb-4">
                    <DialogTitle>Sign In</DialogTitle>
                </DialogHeader>
                <LoginForm showDescription />
            </DialogContent>
        </Dialog>
    );
});

LoginModal.displayName = "LoginModal";

export default LoginModal;
