import { createBrowserRouter } from "react-router";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import ItemIndex from "@/pages/ItemIndex";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "items",
                element: <ItemIndex />,
            },
        ],
    },
]);
