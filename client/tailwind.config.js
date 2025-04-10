/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#171821",
        secondary: "rgba(255,255,255,0.1)",
        secondary2: "#333440",
        accent: "#d8b21d",
        accentAqua: "#A9DFD8",
        accentBlue: "#20AEF3",
        accentPink: "#F2C8ED",
        accentOrange: "#FEB95A",
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
      backgroundImage: {
        "gradient-custom":
          "linear-gradient(150deg, rgba(242,200,237,1) 0%, rgba(169,223,216,1) 100%)",
        "gradient-primary":
          "linear-gradient(150deg, rgba(11,46,51,1) 0%, rgba(79,124,130,1) 100%)",
        "gradient-secondary":
          "linear-gradient(150deg, rgba(242,240,239,1) 0%, rgba(255,255,255,1) 100%)",
        "gradient-blur": "linear-gradient(rgba(255,255,255,0.3),transparent)",
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
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ":focus-visible": {
          outline: `2px solid ${theme("colors.accent")}`,
          outlineOffset: "2px",
        },
        input: {
          outline: "1px solid #d1d5db",
          outlineOffset: "-1px",
        },
      });
    },
  ],
};
