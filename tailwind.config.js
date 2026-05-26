/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fffaf5',   // Rich cream base
          100: '#fff1e2',  // Soft warm tint
          200: '#fed7aa',  // Warm accent line
          300: '#fdba74',  // Light orange
          400: '#fb923c',  // Medium orange
          500: '#f97316',  // Prime orange
          600: '#ea580c',  // Deep orange
          700: '#c2410c',  // Rich burnt orange
          850: '#9a3412',  // Dark sienna accent
          900: '#431407',  // Deep ink brown
          950: '#2a1208',  // Absolute dark sienna
        },
        brand: {
          50: '#fffaf5',   
          100: '#fff1e2',  
          200: '#fed7aa',  
          300: '#fdba74',  
          400: '#fb923c',  
          500: '#f97316',  
          600: '#ea580c',  
          700: '#c2410c',  
          800: '#9a3412',  
          900: '#431407',  
          950: '#2a1208',  
        }
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(67, 20, 7, 0.08)',
        'premium-hover': '0 30px 60px -15px rgba(194, 65, 12, 0.15)',
        'glass': '0 8px 32px 0 rgba(194, 65, 12, 0.03)',
        'inset-soft': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },

  plugins: [],
}; 