/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'my-blue': '#3498db',
        'my-red': '#e74c3c',
        'my-green': '#2ecc71',
      },
      width: {
        '10': '10%',
        '25': '25%',
        '50': '50%',
        '75': '75%',
        '90': '90%',
        '100': '100%',
      },
    },
  },
  plugins: [],
}