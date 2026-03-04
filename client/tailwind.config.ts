// @ts-nocheck
/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";
import { spacing, semanticSpacing } from "./src/theme/tokens/spacing";
import {
  fontSize,
  fontWeight,
  letterSpacing,
  fontFamily,
  textStyles,
} from "./src/theme/tokens/typography";
import { shadows, semanticShadows } from "./src/theme/tokens/shadows";
import { borderRadius, borderWidth } from "./src/theme/tokens/borders";
import { duration, easing, delay } from "./src/theme/tokens/animations";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // Status badge colors - ensure they're included in build
    "bg-green-100",
    "bg-green-900/30",
    "text-green-800",
    "text-green-300",
    "bg-red-100",
    "bg-red-900/30",
    "text-red-600",
    "text-red-300",
    "bg-orange-100",
    "bg-orange-900/30",
    "text-orange-800",
    "text-orange-300",
    "bg-blue-100",
    "bg-blue-900/30",
    "text-blue-800",
    "text-blue-300",
    "bg-gray-100",
    "bg-gray-800",
    "text-gray-800",
    "text-gray-200",
    // Семантические spacing классы - гарантируем их генерацию (без gap)
    {
      pattern: /^(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr)-(xs|sm|md|lg|xl|2xl|3xl)$/,
    },
    // Typography классы - явно указываем все классы
    "typography-h1",
    "typography-h2",
    "typography-h3",
    "typography-h4",
    "typography-h5",
    "typography-h6",
    "typography-body",
    "typography-body-sm",
    "typography-body-lg",
    "typography-label",
    "typography-label-sm",
    "typography-caption",
    "typography-lead",
    "typography-large",
    "typography-small",
    "typography-muted",
    {
      pattern:
        /^typography-(h1|h2|h3|h4|h5|h6|body|body-sm|body-lg|label|label-sm|caption|lead|large|small|muted)$/,
    },
  ],
  theme: {
    extend: {
      // Spacing из токенов
      spacing: {
        // Сначала добавляем семантические значения, чтобы они имели приоритет
        xs: semanticSpacing.xs,
        sm: semanticSpacing.sm,
        md: semanticSpacing.md,
        lg: semanticSpacing.lg,
        xl: semanticSpacing.xl,
        "2xl": semanticSpacing["2xl"],
        "3xl": semanticSpacing["3xl"],
        // Затем базовые числовые значения
        ...spacing,
      },

      // Typography: Nunito Sans (preset font) + токены
      fontFamily: {
        sans: [
          '"Nunito Sans"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: fontFamily.mono,
      },
      fontSize,
      fontWeight,
      letterSpacing,

      // Colors (shadcn + custom) — все через var() из global.css (oklch)
      colors: {
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
          950: "var(--gray-950)",
        },
        // Card (shadcn Neutral — oklch)
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          accent: "var(--card-accent)",
          "accent-foreground": "var(--card-accent-foreground)",
          primary: "var(--card-primary)",
          "primary-foreground": "var(--card-primary-foreground)",
          border: "var(--card-border)",
          ring: "var(--card-ring)",
        },
        // Sidebar (shadcn Neutral)
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        accentGreen: "var(--accent-green)",
        accentAqua: "var(--accent-aqua)",
        accentBlue: "var(--accent-blue)",
        accentPink: "var(--accent-pink)",
        accentOrange: "var(--accent-orange)",
        accentDark: "var(--accent-dark)",
        background: "var(--background)",
        bronze: {
          border: "var(--bronze-border)",
          text: "var(--bronze-text)",
          body: "var(--bronze-body)",
        },
        silver: {
          border: "var(--silver-border)",
        },
        gold: {
          border: "var(--gold-border)",
          text: "var(--gold-text)",
        },
        foreground: "var(--foreground)",
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        tableBorder: "var(--table-border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        level: {
          bronze: {
            DEFAULT: "var(--bronze)",
            foreground: "var(--bronze-foreground)",
          },
          silver: {
            DEFAULT: "var(--silver)",
            foreground: "var(--silver-foreground)",
          },
          gold: {
            DEFAULT: "var(--gold)",
            foreground: "var(--gold-foreground)",
          },
          platinum: {
            DEFAULT: "var(--platinum)",
            foreground: "var(--platinum-foreground)",
          },
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
        "gradient-primary": "linear-gradient(150deg, rgba(11,46,51,1) 0%, rgba(79,124,130,1) 100%)",
        "gradient-secondary":
          "linear-gradient(150deg, rgba(242,240,239,1) 0%, rgba(255,255,255,1) 100%)",
        "gradient-blur": "linear-gradient(rgba(255,255,255,0.3),transparent)",
        "gradient-blurLite": "linear-gradient(rgba(0,0,0,0.3),transparent)",
        "gradient-bronze": "linear-gradient(160deg, #8f4e38, #ba7552, #fecb9e, #ba7552, #8f4e38)",
        "gradient-silver": "linear-gradient(160deg, #909090, #bbbbbb, #ffffff, #bbbbbb, #909090)",
        "gradient-gold": "linear-gradient(160deg, #a54e07, #b47e11, #fef1a2, #bc881b, #a54e07)",
        "gradient-radial-dark":
          "radial-gradient(circle, transparent 0%, rgba(96, 165, 250, 0.3) 30%, rgba(192, 132, 252, 0.3) 60%, rgba(248, 113, 113, 0.3) 90%, transparent 100%)",
        "gradient-radial-light":
          "radial-gradient(circle, transparent 0%, rgba(96, 165, 250, 0.2) 30%, rgba(192, 132, 252, 0.2) 60%, rgba(248, 113, 113, 0.2) 90%, transparent 100%)",
      },

      // Shadows из токенов + custom
      boxShadow: {
        ...shadows,
        ...semanticShadows,
        custom: "-4px -4px 12px hsla(0, 0%, 100%, .05), 4px 4px 12px rgba(0, 0, 0, 0.8)",
        "inset-custom":
          "inset -22px -14px 14px 2px hsla(0, 0%, 100%, .015), inset 8px 4px 20px 12px rgba(0, 0, 0, .8)",
        "inset-2": "inset -2px -2px 4px hsla(0, 0%, 100%, .1), inset 2px 2px 4px rgba(0, 0, 0, .5)",
        "custom-white":
          "-4px -4px 12px hsla(0, 0%, 100%, .05), 4px 4px 12px rgba(255, 255, 255, 0.8)",
        "inset-white":
          "inset -2px -2px 4px hsla(0, 0%, 100%, .1), inset 2px 2px 4px rgba(0, 0, 0, .5)",
        "inset-white-2":
          "inset -2px -2px 4px hsla(0, 0%, 100%, .1), inset 2px 2px 4px rgba(0, 0, 0, .5)",
      },

      // Border radius из токенов + shadcn
      borderRadius: {
        ...borderRadius,
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth,

      // Animations из токенов
      transitionDuration: duration,
      transitionTimingFunction: easing,
      transitionDelay: delay,
    },
  },
  plugins: [
    // function ({ addBase, theme }) {
    //   addBase({
    //     ":focus-visible": {
    //       outline: `2px solid ${theme("colors.accent")}`,
    //       outlineOffset: "2px",
    //     },
    //     input: {
    //       outline: "1px solid #d1d5db",
    //       outlineOffset: "-1px",
    //     },
    //   });
    // },
    // Плагин для семантических типографических утилит
    // Позволяет использовать классы типа .typography-h1, .typography-body напрямую
    function ({ addUtilities, theme }) {
      const typographyUtilities = {};

      // Используем значения из textStyles токенов
      for (const [key, styles] of Object.entries(textStyles)) {
        const utility = {
          fontSize: `${styles.fontSize} !important`,
          lineHeight: `${styles.lineHeight} !important`,
          fontWeight: `${styles.fontWeight} !important`,
        };
        if (styles.letterSpacing) {
          utility.letterSpacing = `${styles.letterSpacing} !important`;
        }
        // Нормализуем ключ (body-sm -> body-sm)
        const normalizedKey = key.replace(/-/g, "-");
        typographyUtilities[`.typography-${normalizedKey}`] = utility;
      }

      // Добавляем специальные варианты
      typographyUtilities[`.typography-lead`] = {
        fontSize: `${fontSize.xl[0]} !important`,
        lineHeight: `${fontSize.xl[1].lineHeight} !important`,
        color: `${theme("colors.muted-foreground")} !important`,
      };
      typographyUtilities[`.typography-large`] = {
        fontSize: `${fontSize.lg[0]} !important`,
        lineHeight: `${fontSize.lg[1].lineHeight} !important`,
        fontWeight: `${fontWeight.semibold} !important`,
      };
      typographyUtilities[`.typography-small`] = {
        fontSize: `${fontSize.sm[0]} !important`,
        lineHeight: "1 !important",
        fontWeight: `${fontWeight.medium} !important`,
      };
      typographyUtilities[`.typography-muted`] = {
        fontSize: `${fontSize.sm[0]} !important`,
        lineHeight: `${fontSize.sm[1].lineHeight} !important`,
        color: `${theme("colors.muted-foreground")} !important`,
      };

      addUtilities(typographyUtilities);
    },
    // Плагин для обработки цветов с var(--...) без hsl() - переопределяет генерацию классов
    function ({ addUtilities, theme }) {
      // Получаем все цвета из темы
      const colors = theme("colors");

      // Функция для рекурсивного поиска цветов с var(--...) без hsl()
      function findVarColors(obj, prefix = "") {
        const result = [];
        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}-${key}` : key;
          const isVar = typeof value === "string" && value.startsWith("var(--");
          const isNotHsl = typeof value === "string" && !value.startsWith("hsl(var(--");
          if (isVar && isNotHsl) {
            result.push(fullKey);
          } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            const nested = findVarColors(value, fullKey);
            for (let i = 0; i < nested.length; i++) {
              result.push(nested[i]);
            }
          }
        }
        return result;
      }

      const varColors = findVarColors(colors);

      // Генерируем утилиты для всех найденных цветов
      const utilities = {};

      for (const colorKey of varColors) {
        // Извлекаем имя переменной из var(--variable-name)
        const colorValue = theme(`colors.${colorKey}`);
        if (typeof colorValue === "string" && colorValue.startsWith("var(--")) {
          const match = colorValue.match(/var\(--([^)]+)\)/);
          if (match && match[1]) {
            const varName = match[1];
            // bg-* классы
            utilities[`.bg-${colorKey}`] = {
              "background-color": `var(--${varName})`,
            };
            // text-* классы
            utilities[`.text-${colorKey}`] = {
              color: `var(--${varName})`,
            };
            // border-* классы
            utilities[`.border-${colorKey}`] = {
              "border-color": `var(--${varName})`,
            };
            // ring-* классы
            utilities[`.ring-${colorKey}`] = {
              "--tw-ring-color": `var(--${varName})`,
            };
          }
        }
      }

      addUtilities(utilities);
    },
    // Плагин: opacity-варианты для семантических цветов (oklch + color-mix)
    function ({ addUtilities, theme }) {
      const colors = theme("colors");
      function findVarColors(obj, prefix = "") {
        const result = [];
        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}-${key}` : key;
          const isVar = typeof value === "string" && value.startsWith("var(--");
          const isNotHsl = typeof value === "string" && !value.startsWith("hsl(var(--");
          if (isVar && isNotHsl) {
            result.push(fullKey);
          } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            const nested = findVarColors(value, fullKey);
            result.push(...nested);
          }
        }
        return result;
      }
      const varColors = findVarColors(colors);
      const opacities = [10, 20, 40, 50, 60, 80, 90];
      const utilities = {};
      const themePath = (key) => `colors.${key.replace(/-/g, ".")}`;
      for (const colorKey of varColors) {
        const colorValue = theme(themePath(colorKey));
        if (typeof colorValue !== "string" || !colorValue.startsWith("var(--")) continue;
        const match = colorValue.match(/var\(--([^)]+)\)/);
        if (!match?.[1]) continue;
        const varName = match[1];
        const varRef = `var(--${varName})`;
        const displayKey = colorKey.replace(/-DEFAULT$/, "");
        for (const opacity of opacities) {
          const value = `color-mix(in oklch, ${varRef} ${opacity}%, transparent)`;
          const slash = `${displayKey}\\/${opacity}`;
          utilities[`.bg-${slash}`] = { "background-color": value };
          utilities[`.text-${slash}`] = { color: value };
          utilities[`.border-${slash}`] = { "border-color": value };
          utilities[`.ring-${slash}`] = { "--tw-ring-color": value };
          utilities[`.from-${slash}`] = {
            "--tw-gradient-from": value,
            "--tw-gradient-to": "transparent",
            "--tw-gradient-stops": "var(--tw-gradient-from), var(--tw-gradient-to)",
          };
          utilities[`.to-${slash}`] = {
            "--tw-gradient-to": value,
            "--tw-gradient-stops": "var(--tw-gradient-from), var(--tw-gradient-to)",
          };
          utilities[`.via-${slash}`] = {
            "--tw-gradient-via": value,
            "--tw-gradient-stops":
              "var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to)",
          };
        }
      }
      addUtilities(utilities);
    },
    tailwindcssAnimate,
  ],
};
