import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/theme";
import plugin from "tailwindcss/plugin";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            textShadow: {
                DEFAULT: "0 2px 4px rgba(0,0,0,0.4)",
                "light-dark": "5px 4px 7px rgba(0,0,0,0.6)",
                dark: "5px 4px 7px rgba(0,0,0,0.7)",
                darker: "5px 4px 7px rgba(0,0,0,0.9)",
            },
            screens: {
                xs: "480px",
                "3xl": "1800px",
            },
            dropShadow: {
                fav: "0 0 3px rgba(255, 0, 0, 0.9)",
                dark: "7px 5px 7px rgba(0, 0, 0, 0.9)",
                "light-gray": "7px 5px 7px rgba(0, 0, 0, 0.3)",
                "light-dark": "3px 5px 10px rgba(0, 0, 0, 0.6)",
                glow: "0px 0px 15px #ffffff90",
                "glow-low": "0px 0px 15px #ffffff25",
                "glow-medium": "0px 0px 15px #ffffff45",
            },
            height: {
                "1px": "1px",
            },
            boxShadow: {
                dark: "3px 5px 10px rgba(0, 0, 0, 0.9)",
                "light-dark": "3px 5px 10px rgba(0, 0, 0, 0.6)",
                "sm-light-dark": "2px 3px 5px rgba(0, 0, 0, 0.4)",
            },
            colors: {
                dark: "#05060b",
                popup: "#0c0e1d",
                "nova-light-dark": "#263244",
                "nova-dark": "#1d2d39",
                "nova-darker": "#090f13",
                "nova-darker-2": "#091119",
                "nova-red": "#870001",
                "nova-light-red": "#ad1c1d",
                "nova-link": "#d3e3f5",
                "nova-light": "#e3e6ee",
                "nova-light2": "#8091a3",
                "nova-button": "#05689c",
                "nova-gray": "#bfbfbf",
                "nova-error": "#f01d1d",
            },
            flex: {
                "1c": "0 0 100%",
                "2c": "0 0 50%",
                "3c": "0 0 33.333333%",
                "4c": "0 0 25%",
                "5c": "0 0 20%",
                "6c": "0 0 16.666667%",
            },
            aspectRatio: {
                wide: "3 / 1",
                "21-9": "21 / 9",
                file: "9 / 12",
                short: "9/16",
            },
            maskImage: {
                borders: "linear-gradient(to right, transparent, black 50%, transparent)",
                "borders-10": "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                "borders-y-10": "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
                left: "linear-gradient(to right, transparent, black 100%)",
                right: "linear-gradient(to right, black, transparent 100%)",
                "top-50": "linear-gradient(to top, transparent, black 50%, transparent)",
                "bottom-10": "linear-gradient(to bottom, black 80%, transparent 100%)",
                "top-10": "linear-gradient(to top, black 80%, transparent 100%)",
            },
            backgroundImage: {
                sketch: "repeating-linear-gradient(-45deg, rgba(0, 111, 238, 0.5), rgba(0, 111, 238, 0.5) 2px, transparent 2px, transparent 15px)",
            },
        },
    },
    darkMode: "class",
    plugins: [
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    "text-shadow": (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme("textShadow") }
            );
        }),
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    mask: (value) => ({
                        maskImage: value,
                        WebkitMaskImage: value,
                    }),
                },
                { values: theme("maskImage") }
            );
        }),

        nextui({
            addCommonColors: true,
        }),
    ],
};
export default config;
