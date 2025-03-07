/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#13283c',
        accent: '#d8b21d',
        accentDark: '#b09119',
        background: 'rgb(245, 241, 237)',
        bronze: {
          500: '#CD7F32',
        }
      },
      textUnderlineOffset: {
        '4': '4px',
        '6': '6px',
      },
      backgroundOpacity: {
        '10': '0.1',
        '20': '0.2',
        '95': '0.95',
      },
    },
  },
  plugins: [],
}

