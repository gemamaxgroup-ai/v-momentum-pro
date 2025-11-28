import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vm: {
          bg: "#02010a",
          bgSoft: "#050816",
          card: "#0b1220",
          panel: "#0b1220",
          border: "#1f2937",
          primary: "#22c1f1",
          primarySoft: "#1b9bd8",
          accent: "#0EA5E9",
          textMain: "#f9fafb",
          textMuted: "#9ca3af",
        },
      },
    },
  },
  plugins: [],
};

export default config;

