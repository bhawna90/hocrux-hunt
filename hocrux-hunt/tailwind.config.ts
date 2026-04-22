import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#fdf8f0",
          100: "#f5e6c8",
          200: "#ead4a0",
          300: "#d4b578",
          400: "#b8925a",
          DEFAULT: "#c9a96e",
        },
        "hp-gold": {
          light: "#ffd700",
          DEFAULT: "#c9a96e",
          dark: "#8b6914",
        },
        "hp-dark": {
          DEFAULT: "#0a0a1a",
          lighter: "#12122a",
          card: "#1a1a3a",
        },
        "gryffindor-red": "#740001",
        "gryffindor-gold": "#d3a625",
        "slytherin-green": "#1a472a",
        "slytherin-silver": "#aaaaaa",
        "ravenclaw-blue": "#0e1a40",
        "ravenclaw-bronze": "#946b2d",
        "hufflepuff-yellow": "#ecb939",
        "hufflepuff-black": "#372e29",
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        crimson: ["var(--font-crimson)", "serif"],
      },
      backgroundImage: {
        "star-field": "radial-gradient(ellipse at center, #1a1a3a 0%, #0a0a1a 100%)",
      },
      animation: {
        "float-candle": "floatCandle 6s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "seal-spin": "sealSpin 1s ease-out",
        "scroll-unfurl": "scrollUnfurl 0.8s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "shake": "shake 0.5s ease-in-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
      keyframes: {
        floatCandle: {
          "0%, 100%": { transform: "translateY(0px) rotate(-2deg)" },
          "50%": { transform: "translateY(-20px) rotate(2deg)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.3", transform: "scale(0.8)" },
        },
        sealSpin: {
          "0%": { transform: "rotate(0deg) scale(0.8)", opacity: "0" },
          "60%": { transform: "rotate(370deg) scale(1.1)" },
          "100%": { transform: "rotate(360deg) scale(1)", opacity: "1" },
        },
        scrollUnfurl: {
          "0%": { maxHeight: "0", opacity: "0" },
          "100%": { maxHeight: "500px", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-8px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(8px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(201, 169, 110, 0.4)" },
          "50%": { boxShadow: "0 0 30px rgba(201, 169, 110, 0.8), 0 0 60px rgba(201, 169, 110, 0.3)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
