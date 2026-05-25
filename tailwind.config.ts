import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        poxiol: {
          black: "#050505",
          charcoal: "#111111",
          lime: "#B6FF00"
        }
      }
    }
  },
  plugins: []
};

export default config;
