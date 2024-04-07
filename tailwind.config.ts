import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/theme";
import plugin from "tailwindcss/plugin";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/components/(button|chip|navbar|pagination|spinner|divider|input|modal|kbd).js",
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
            },
            dropShadow: {
                fav: "0 0 3px rgba(255, 0, 0, 0.9)",
                dark: "7px 5px 7px rgba(0, 0, 0, 0.9)",
                "light-gray": "7px 5px 7px rgba(0, 0, 0, 0.3)",
                "light-dark": "7px 5px 7px rgba(0, 0, 0, 0.6)",
                glow: "0px 0px 15px #ffffff90",
                "glow-low": "0px 0px 15px #ffffff25",
                "glow-medium": "0px 0px 15px #ffffff45",
            },
            boxShadow: {
                "dark": "3px 5px 10px rgba(0, 0, 0, 0.9)",
                "light-dark": "3px 5px 10px rgba(0, 0, 0, 0.6)",
            },
            colors: {
                dark: "#05060b",
                popup: "#0c0e1d",
                "nova-light-dark": "#263244",
                "nova-dark": "#1d2d39",
                "nova-darker": "#090f13",
                "nova-darker-2": "#091119",
                "nova-red": "#7c0203",
                "nova-link": "#d3e3f5",
                "nova-light": "#e3e6ee",
                "nova-light2": "#8091a3",
                "nova-button": "#05689c",
                "nova-gray": "#bfbfbf"
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
        nextui({
            addCommonColors: true,
        }),
    ],
};
export default config;
