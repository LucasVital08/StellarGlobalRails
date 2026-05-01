import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#07111f",
        ink: "#0e1728",
        slate: "#9fb0c6",
        glow: "#4aa8ff",
        teal: "#14d8c8",
        mint: "#72f2b5"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(74, 168, 255, 0.18), 0 30px 80px rgba(4, 15, 35, 0.5)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top, rgba(20,216,200,0.14), transparent 32%), radial-gradient(circle at 80% 20%, rgba(74,168,255,0.18), transparent 28%), linear-gradient(180deg, #050b16 0%, #07111f 50%, #050a12 100%)"
      },
      animation: {
        pulseSlow: "pulse 3.8s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -12px, 0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
