import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '460px'
      },
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'ui-sans-serif'],
      },

    },
  },
  plugins: [],
};
