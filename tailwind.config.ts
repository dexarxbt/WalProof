import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#07111F",
        midnight: "#0B1B33",
        royal: "#155EEF",
        electric: "#2F80FF",
        ice: "#BFE3FF",
        soft: "#F4F8FF",
        mist: "#D8E4F2",
        slate: "#8EA4BF",
        success: "#3DDC97",
        warning: "#F7B955",
        danger: "#FF5C7A",
        border: "rgba(216,228,242,0.18)"
      },
      boxShadow: {
        glow: "0 0 45px rgba(47,128,255,0.25)",
        glass: "0 18px 60px rgba(0,0,0,0.32)"
      },
      borderRadius: {
        card: "8px"
      }
    }
  },
  plugins: []
};

export default config;
