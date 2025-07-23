const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f5f4ed',
        sidebar: '#f0eee8',
        surface: '#fcfbf7',
        border: '#e4e2da',
        'text-primary': '#383631',
        'text-secondary': '#7a7874',
        primary: '#607d8b', // Muted Blue Grey
        'primary-hover': '#546e7a', // Darker Blue Grey
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
