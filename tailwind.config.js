/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: "hsl(180, 84%, 24%)",
        "civic-orange": "hsl(25, 95%, 53%)",
        "civic-purple": "hsl(265, 84%, 65%)",
        "civic-blue": "hsl(217, 91%, 60%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
} 