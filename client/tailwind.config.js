/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#13283c",
        accent: "#d8b21d",
        accentDark: "#b09119",
        background: "rgb(245, 241, 237)",
        bronze: {
          500: "#CD7F32",
        },
      },
      textUnderlineOffset: {
        4: "4px",
        6: "6px",
      },
      backgroundOpacity: {
        10: "0.1",
        20: "0.2",
        95: "0.95",
      },
      boxShadow: {
        custom:
          "-4px -4px 12px hsla(0, 0%, 100%, .05), 4px 4px 12px rgba(0, 0, 0, 0.8)",
        "inset-custom":
          "inset -22px -14px 14px 2px hsla(0, 0%, 100%, .015), inset 8px 4px 20px 12px rgba(0, 0, 0, .8)",
        "inset-2":
          "inset -2px -2px 4px hsla(0, 0%, 100%, .1), inset 2px 2px 4px rgba(0, 0, 0, .5)",
        "custom-white":
          "-8px -8px 12px hsla(0, 0%, 100%, .8), 8px 8px 12px rgba(0, 0, 0, .05)",
        "inset-white":
          "inset -2px -2px 4px hsla(0, 0%, 100%, .1), inset 2px 2px 4px rgba(0, 0, 0, .5)",
        "inset-white-2":
          "inset -2px -2px 4px hsla(0, 0%, 100%, .1), inset 2px 2px 4px rgba(0, 0, 0, .5)",
      },
    },
  },
  plugins: [],
};
