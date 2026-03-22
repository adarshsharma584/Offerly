import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
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
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        green: {
          50: '#F0F7F4',
          100: '#D8F3DC',
          200: '#B7E4C7',
          400: '#52B788',
          600: '#40916C',
          700: '#2D6A4F',
          900: '#1B4332',
        },
        teal: {
          DEFAULT: 'hsl(var(--teal))',
          light: 'hsl(var(--teal-light))',
        },
        coral: {
          DEFAULT: 'hsl(var(--coral))',
          light: 'hsl(var(--coral-light))',
        },
        indigo: {
          DEFAULT: 'hsl(var(--indigo))',
          light: 'hsl(var(--indigo-light))',
        },
        gold: {
          DEFAULT: '#B45309',
          light: '#FEF3C7',
        },
        app: {
          bg: '#F7FAF8',
          border: '#E5E7EB',
          text: '#111827',
          mid: '#374151',
          muted: '#9CA3AF',
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "50px",
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 1px 8px rgba(17,24,39,0.06)',
        'card-md': '0 4px 16px rgba(17,24,39,0.10)',
        'card-lg': '0 8px 32px rgba(17,24,39,0.14)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.08)',
        'glass-lg': '0 16px 48px rgba(31, 38, 135, 0.12)',
        nav: '0 -4px 20px rgba(0,0,0,0.08)',
        'qr-glow': '0 0 0 3px #D8F3DC, 0 8px 32px rgba(45,106,79,0.20)',
        'glow': '0 0 20px rgba(45, 106, 79, 0.15)',
        'glow-lg': '0 0 40px rgba(45, 106, 79, 0.25)',
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
