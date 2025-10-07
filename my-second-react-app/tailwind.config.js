/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#f8fafc",
        },
        secondary: {
          DEFAULT: "#0f172a",
          foreground: "#e2e8f0",
        },
      },
      boxShadow: {
        surface: "0 20px 45px -20px rgba(15, 23, 42, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
