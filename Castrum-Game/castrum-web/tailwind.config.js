/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'viking-dark': '#1a202c',
        'castrum-gold': '#d69e2e',
      }
    },
  },
  plugins: [],
}