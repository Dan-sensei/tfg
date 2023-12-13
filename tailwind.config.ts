import type { Config } from 'tailwindcss'
const {nextui} = require("@nextui-org/theme");

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/components/(button|chip).js",
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
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}
export default config
