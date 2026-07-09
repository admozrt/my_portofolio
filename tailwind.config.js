/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist Variable", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Geist Mono Variable", "ui-monospace", "monospace"],
      },
      // Single locked accent (electric blue) used identically across the whole page.
      colors: {
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Locked accent for the "Control Room" homepage only (operational green).
        ops: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      maxWidth: {
        "8xl": "88rem",
      },
      // One radius scale: pill (full) for interactive, 2xl for containers, xl for inputs/buttons.
      borderRadius: {
        card: "1rem",
      },
      animation: {
        "blink-cursor": "blinkCursor 1.1s step-end infinite",
        marquee: "marquee 40s linear infinite",
        flicker: "flicker 0.4s steps(6, end)",
      },
      keyframes: {
        blinkCursor: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        flicker: {
          "0%": { opacity: "0" },
          "20%": { opacity: "0.7" },
          "35%": { opacity: "0.1" },
          "50%": { opacity: "0.9" },
          "65%": { opacity: "0.3" },
          "80%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
      },
      transitionTimingFunction: {
        signature: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
