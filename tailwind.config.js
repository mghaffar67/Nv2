
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'bg-base': 'var(--bg-base)',
        'text-base': 'var(--text-base)',
        'card-base': 'var(--card-base)',
      },
      fontFamily: {
        global: 'var(--global-font)',
      },
      borderRadius: {
        'theme': 'var(--radius-base)',
      }
    },
  },
  plugins: [],
};
