import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        panel: "#13161b",
        panel2: "#1a1e25",
        line: "#262b34",
        ink: "#e7ecf3",
        mute: "#8a93a3",
        accent: "#7c5cff",
        good: "#3ddc97",
        warn: "#ffb454",
        bad: "#ff5d6c",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
