import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/theme");

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/components/(button|chip|navbar|pagination|spinner).js",
    ],
    theme: {
        extend: {
            screens:{
                'xs':'480px'
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
                "xl-d": "5px 3px 10px rgba(0, 0, 0, 0.7)",
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
                "nova-button": "#05689c",
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
        nextui({
            addCommonColors: true,
            themes: {
                dark: {
                    colors: {
                        primary: {
                            DEFAULT: "#05689c",
                            foreground: "#fff",
                        },
                    },
                },
            },
        }),
    ],
};
export default config;
