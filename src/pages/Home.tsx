import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Home = () => {
    return (
        <div>
            <div>Hello, world!</div>
            <div className="flex gap-4">
                <Button>
                    <div className="flex flex-nowrap gap-x-1 items-center">
                        <Check size={64} />
                        primary
                    </div>
                </Button>
                <Button variant="secondary">secondary</Button>
                <Button variant="accent">accent</Button>
                <Button size="icon">
                    <Check />
                </Button>
                <p className="text-muted-foreground">Some muted text</p>
            </div>
        </div>
    );
};

export default Home;
