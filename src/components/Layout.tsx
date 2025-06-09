import { Outlet } from "react-router";

export default function Layout() {
    return (
        <>
            <header className="h-8 bg-primary grid grid-cols-1 items-center">
                <div className="title text-lg flex items-center text-primary-foreground px-2">
                    grail.
                </div>
            </header>

            <main>
                <Outlet />
            </main>

            {/* <footer></footer> */}
        </>
    );
}
