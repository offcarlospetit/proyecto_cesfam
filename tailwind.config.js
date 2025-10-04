/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Referencias desde styles.css (header/nav) y login.css (botón primario):
        nav: "#004080", // header principal (styles.css)
        navAlt: "#0066cc", // barra de navegación (styles.css)
        primary: "#1366d6", // primario general (styles.css tokens)
        brand: { DEFAULT: "#2980b9", dark: "#1c5980" }, // login button (login.css)
        textBase: "#1f2937", // texto base (styles.css)
        muted: "#6b7280", // texto atenuado (styles.css)
        border: "#e5e7eb", // borde tablas (styles.css)
        danger: "#c0392b", // error login (login.css)
        chip: {
          base: "#eef2ff", // chip base (styles.css)
          border: "#dbeafe",
        },
      },
    },
  },
  plugins: [],
};
