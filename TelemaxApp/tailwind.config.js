/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tobacco: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#8B4513', // Main tobacco brown
          800: '#846358',
          900: '#43302b',
        },
        primary: '#8B4513',
        secondary: '#f8f8f8',
      },
      fontFamily: {
        'sans': ['System'],
      },
    },
  },
  plugins: [],
}