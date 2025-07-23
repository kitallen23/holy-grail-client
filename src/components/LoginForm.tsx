import DiscordIcon from "./DiscordIcon";
import GoogleIcon from "./GoogleIcon";
import { Button } from "./ui/button";

type Props = { showDescription?: boolean };

function LoginForm({ showDescription }: Props) {
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };
    const handleDiscordLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
    };

    return (
        <div className="flex flex-col gap-4">
            <Button className="gap-2" onClick={handleDiscordLogin}>
                <DiscordIcon />
                Continue with Discord
            </Button>
            <Button className="gap-2" onClick={handleGoogleLogin}>
                <GoogleIcon />
                Continue with Google
            </Button>
            {showDescription ? (
                <span className="text-muted-foreground text-sm">
                    Sign in to save your progress across devices.
                </span>
            ) : null}
        </div>
    );
}

export default LoginForm;
