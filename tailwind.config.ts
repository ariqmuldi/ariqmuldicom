/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#D84040",
          600: "#8E1616",
          700: "#7f1d1d",
          800: "#7f1d1d",
          900: "#6b1010",
          950: "#4a0d0d",
        },
        background: {
          primary: "#1D1616",
          secondary: "#0A0808",
          card: "rgba(142, 22, 22, 0.05)",
          "card-hover": "rgba(142, 22, 22, 0.1)",
        },
        text: {
          primary: "#EEEEEE",
          secondary: "rgba(238, 238, 238, 0.7)",
          muted: "rgba(238, 238, 238, 0.5)",
        },
        accent: {
          red: "#FF6B6B",
          "red-dark": "#8E1616",
          "red-medium": "#D84040",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(142, 22, 22, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(216, 64, 64, 0.5)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(142, 22, 22, 0.3)",
        "glow-lg": "0 0 40px rgba(142, 22, 22, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(142, 22, 22, 0.1)",
      },
    },
  },
  plugins: [],
};
