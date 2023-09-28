/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        buttonG1: "#d83333",
        buttonG2: "#f041ff",
      },
      keyframes: {
        vpnBounce: {
          "0%, 100%": { transform: "translateY(-2%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      animation: {
        vpnBounce: "vpnBounce 3s ease-in-out infinite",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  plugins: [],
};
