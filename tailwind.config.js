/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': 'var(--bg-color)',
        'button-color': 'var(--button-color)',
        'button-select-color': 'var(--button-select-color)',

        'auth-bg':'var(--auth-bg)',
        'auth-hover-prevBtn':'var(----auth-hover-prevBtn)',
        'auth-head-text':'var(----auth-head-text)',
        'auth-label':'var(--auth-label)',
        'auth-inpBor':'var(--auth-inpBor)',
        'auth-inpBg':'var(--auth-inpBg)',
        'auth-focRing':'var(--auth-focRing)',
        'auth-hover-focRing':'var(--auth-hover-focRing)',
        'auth-SBtn':'var(--auth-SBtn)',
        'auth-muted':'var(--auth-muted)',
        'auth-hover-GBtn':'var(--auth-hover-GBtn)',
        'auth-whiteText':'var(--auth-whiteText)',
        'auth-icon-GBtn':'var(--auth-icon-GBtn)',
      },
    },
  },
  plugins: [],
}