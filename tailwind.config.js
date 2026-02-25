/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        negro:  '#0a0a0a',
        dorado: '#C9A84C',
        'dorado-claro': '#E8C97A',
        'dorado-oscuro': '#8B6914',
        vino:   '#5C1A2E',
        crema:  '#F5F0E8',
        plata:  '#8a8a8a',
      },
      fontFamily: {
        serif:  ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:   ['Montserrat', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.5em',
      },
    },
  },
  plugins: [],
}
