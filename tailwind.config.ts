import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))", // Será cfe-green
        background: "hsl(var(--background))", // Blanco puro
        foreground: "hsl(var(--foreground))", // Casi negro
        primary: {
          DEFAULT: "hsl(var(--primary))", // cfe-green
          foreground: "hsl(var(--primary-foreground))", // cfe-text-on-green
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // cfe-black
          foreground: "hsl(var(--secondary-foreground))", // Blanco o casi blanco
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // Rojo
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // Gris claro para fondos de input alternativos
          foreground: "hsl(var(--muted-foreground))", // Gris medio para placeholders/texto ayuda
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", // Blanco
          foreground: "hsl(var(--card-foreground))",
        },
        // Colores específicos CFE
        "cfe-green": "#008E5A",
        "cfe-black": "#111111",
        "cfe-text-on-green": "#FFFFFF",
        "cfe-green-very-light": "#E6F4EF",
        "highlight-yellow": "#FFFFE0",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Noto Sans", "Open Sans", "Lato", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
