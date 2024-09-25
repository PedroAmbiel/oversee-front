/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  safelist: ["dark"],
  prefix: "",
  plugins: [require('tailwindcss-primeui')],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      screens:{
        'sm': '360px',
        'h-sm': { 'raw': '(min-height: 360px)', 'raw': '(min-width: 667px)' }, //Custom responsive sizes for height
        // 'h-md': { 'raw': '(min-height: 1280px)', 'raw': '(min-width:  800px)' }, 
        'h-lg': { 'raw': '(min-height: 1280px)', 'raw': '(min-width: 950px)' },
        // 'h-xl': { 'raw': '(min-height: 1080px)' },
      },
    },  
  },
 
}

