import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores principales - Rosa/Negro/Blanco
        primary: "#1a1a1a",           // Negro principal
        secondary: "#e91e63",         // Rosa principal
        accent: "#ff4081",            // Rosa claro/accent
        
        // Fondos
        cream: "#fdf2f4",             // Rosa muy claro para fondos
        white: "#ffffff",             // Blanco
        
        // Grises
        grey: "#6b7280",              // Gris texto
        "light-grey": "#f3f4f6",      // Gris claro
        "dark-grey": "#374151",       // Gris oscuro
        
        // Modo oscuro
        dark: "#0a0a0a",              // Negro profundo
        "dark-card": "#1a1a1a",       // Tarjetas oscuras
        "dark-border": "#2a2a2a",     // Bordes oscuros
        "dark-surface": "#141414",    // Superficies oscuras
        
        // Colores de estado
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
        pulse: "pulse 2s infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #e91e63 0%, #ff4081 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
