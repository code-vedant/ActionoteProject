/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', 
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'greatvibes': ['"Great Vibes"', 'cursive'],
        'alarm': ['"alarm clock"', 'regular'],
        'open' : ['"Open 24 Display St"', 'regular']
      },
      colors: {
        'charcoal-gray': '#2b2b2b',    // dark background
        'off-white': '#f9f7e8',        // light background
        'sky-blue': '#39a2ff',         // primary accent
        'warm-amber': '#ffab4c',       // secondary accent
        'lime-green': '#8ac926',       // secondary accent
        'coral-red': '#ff6b6b',        // secondary accent
        'light-gray': '#e0e0e0',       // neutral color for borders, dividers
        'mid-gray': '#4a4a4a',         // for text on light backgrounds
        'muted-silver': '#b8b8b8',     // for less prominent text or icons
        'taupe-gray': '#9e9d89'        // subtle, warm neutral
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
}

