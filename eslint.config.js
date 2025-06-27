import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        ignores: ["src/routeTree.gen.ts"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/jsonc",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.css"],
        plugins: { css },
        language: "css/css",
        extends: ["css/recommended"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "no-console": ["warn", { allow: ["info", "warn", "error"] }],
        },
    },
]);
