/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        login: "url('assets/login-bg.jpg')",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"], // Ajoutez 'Inter' comme une police personnalisée
        roboto: ["Roboto", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      screens: {
        xs: "500px",
      },
      colors: {
        primary: {
          DEFAULT: "#F20024",
          dark: "#a00b1f",
          light: "#ff99a6",
        },
        darkBlue: {
          DEFAULT: "#141F30",
          light: "#1E283A",
        },
      },
    },
  },
  plugins: [],
};
