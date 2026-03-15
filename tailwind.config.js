/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Essential configuration for seamless canvas blend
        background: '#050505',
      },
      fontFamily: {
        // Enforce Inter and SF Pro for beautiful clean typography
        sans: [
          '"Inter"',
          '"SF Pro Display"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
      }
    },
  },
  plugins: [],
}
