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
          50: "#f4f4f8",
          100: "#e9e9f1",
          200: "#d3d4e3",
          300: "#b8bbd1",
          400: "#98A1BC",
          500: "#555879",
          600: "#3d3f5c",
          700: "#2c2e3f",
          800: "#1f2130",
          900: "#161721",
          950: "#0d0e14",
        },
        background: {
          primary: "#F4EBD3",
          secondary: "#faf7f0",
          tertiary: "#DED3C4",
          card: "rgba(255, 255, 255, 0.6)",
          "card-hover": "rgba(255, 255, 255, 0.8)",
          dark: "#2c2e3f",
        },
        text: {
          primary: "#2c2e3f",
          secondary: "rgba(44, 46, 63, 0.8)",
          muted: "rgba(44, 46, 63, 0.6)",
          light: "#ffffff",
          cream: "#F4EBD3",
        },
        accent: {
          purple: "#555879",
          "purple-dark": "#3d3f5c",
          "purple-light": "#98A1BC",
          beige: "#DED3C4",
          cream: "#F4EBD3",
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
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
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
            boxShadow: "0 0 20px rgba(85, 88, 121, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(152, 161, 188, 0.5)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
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
        glow: "0 0 20px rgba(85, 88, 121, 0.2)",
        "glow-lg": "0 0 40px rgba(85, 88, 121, 0.3)",
        "inner-glow": "inset 0 0 20px rgba(85, 88, 121, 0.05)",
        soft: "0 10px 40px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 20px 60px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh": "url('/mesh-gradient.svg')",
      },
    },
  },
  plugins: [],
};
