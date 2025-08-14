import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
        }),
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
            },
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon.png",
                "favicon.svg",
                "favicon-16x16.png",
                "favicon-32x32.png",
                "android-chrome-192x192.png",
                "android-chrome-512x512.png",
            ],
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        watch: {
            ignored: ["assets/**"],
        },
    },
});
