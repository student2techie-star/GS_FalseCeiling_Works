/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plaster: 'var(--plaster)',
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        slate: 'var(--slate)',
        line: 'var(--line)',
        blue: 'var(--blue)',
        cove: 'var(--cove)',
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['Figtree', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        md: '8px',
      }
    },
  },
  plugins: [],
}
