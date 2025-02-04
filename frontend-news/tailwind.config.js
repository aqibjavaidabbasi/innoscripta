/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'headerBg': '#232124',
        'borderColor': '##AEA977',
        'tertiary': '#0000FF',
      },
    },
  },
  plugins: [],
}