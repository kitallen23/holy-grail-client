import { createBrowserRouter } from "react-router";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
]);
