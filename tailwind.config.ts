import type { Config } from 'tailwindcss'
const {nextui} = require("@nextui-org/theme");

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/components/(button|chip|navbar).js",
  ],
  theme: {
    extend: {
      dropShadow:{
        'fav': '0 0 3px rgba(255, 0, 0, 0.9)'
      },
      boxShadow: {
        'xl-d': '5px 3px 10px rgba(0, 0, 0, 0.7)',
      },
      colors:{
        'dark': '#05060b',
        'popup': '#0c0e1d'
      },
      flex: {
        '1c': '0 0 100%',
        '2c': '0 0 50%',
        '3c': '0 0 33.333333%',
        '4c': '0 0 25%',
        '5c': '0 0 20%',
        '6c': '0 0 16.666667%',
      },
      aspectRatio: {
        'wide': '3 / 1',
        'file': '9 / 12'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui({
    addCommonColors: true,
  })]
}
export default config
