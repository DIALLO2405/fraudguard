/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bleu:   '#1B3A6B',
        cyan:   '#2E75B6',
        vert:   '#27AE60',
        rouge:  '#C0392B',
        orange: '#E67E22',
      }
    },
  },
  plugins: [],
}