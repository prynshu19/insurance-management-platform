/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette from UI reference
        brand: {
          red: "#FF4B4B",
          "red-dark": "#E63939",
          green: "#00C48C",
          "green-light": "#E8FFF7",
          "green-mid": "#4CAF50",
        },
        sidebar: "#FFFFFF",
        surface: "#F7FFFE",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 12px 0 rgba(0,0,0,0.07)",
        modal: "0 8px 40px 0 rgba(0,0,0,0.14)",
      },
    },
  },
  plugins: [],
};
