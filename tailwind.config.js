/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
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
        border: "#333",
        input: "#444",
        ring: "#555",
        background: "#111",
        foreground: "#eee",
        primary: {
          DEFAULT: "#888",
          foreground: "#111",
        },
        secondary: {
          DEFAULT: "#777",
          foreground: "#111",
        },
        destructive: {
          DEFAULT: "#ff5757",
          foreground: "#111",
        },
        muted: {
          DEFAULT: "#444",
          foreground: "#eee",
        },
        accent: {
          DEFAULT: "#666",
          foreground: "#111",
        },
        popover: {
          DEFAULT: "#222",
          foreground: "#eee",
        },
        card: {
          DEFAULT: "#222",
          foreground: "#eee",
        },
        'selected-border': '#fff', 
        'neon-green': '#fff',
        'primary-dark': '#333',
        'custom-gray': '#808080', 
        gray: {
          50: '#1f2937',
          100: '#111827',
          200: '#000',
          300: '#222',
          400: '#333',
          500: '#444',
          600: '#555',
          700: '#666',
          800: '#777',
          900: '#888',
          950: '#999',
        },
        metallic: {
          100: '#222',
          200: '#333',
          300: '#444',
          400: '#555',
          500: '#666',
          600: '#777',
          700: '#888',
          800: '#999',
          900: '#aaa',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, #222 0%, #111 100%)',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, #222 0deg, #111 360deg)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
