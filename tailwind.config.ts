import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        foreground: "#e5e7eb",
        card: {
          DEFAULT: "#020617",
          foreground: "#e5e7eb"
        },
        border: "#1f2937",
        primary: {
          DEFAULT: "#38bdf8",
          foreground: "#020617"
        },
        secondary: {
          DEFAULT: "#1f2937",
          foreground: "#e5e7eb"
        },
        muted: {
          DEFAULT: "#020617",
          foreground: "#6b7280"
        },
        accent: {
          DEFAULT: "#4f46e5",
          foreground: "#e5e7eb"
        },
        destructive: {
          DEFAULT: "#b91c1c",
          foreground: "#f9fafb"
        },
        success: {
          DEFAULT: "#16a34a",
          foreground: "#ecfdf3"
        }
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem"
      },
      boxShadow: {
        glow: "0 0 40px rgba(56,189,248,0.35)",
        "glow-soft": "0 0 30px rgba(79,70,229,0.35)"
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(circle at top, rgba(56,189,248,0.3), transparent 60%), radial-gradient(circle at bottom, rgba(79,70,229,0.35), transparent 65%)"
      }
    }
  },
  plugins: []
};

export default config;

