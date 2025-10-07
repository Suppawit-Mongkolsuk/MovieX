/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        movix: {
          red: "#E50914",   // 🔴 สีแดงหลัก
          gold: "#FFD700",  // 🟡 สีทอง
          dark: "#0B0B0B",  // ⚫ สีดำพื้นหลัง
        },
      },
      fontFamily: {
        movix: ["Inter", "Kanit", "sans-serif"], // ฟอนต์หลัก
      },
    },
  },
  plugins: [],
};

