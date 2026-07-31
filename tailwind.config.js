/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./fallback.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          bg: '#05070d',
          card: 'rgba(13, 18, 30, 0.75)',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { opacity: '0.3', filter: 'blur(25px)' },
          '100%': { opacity: '0.7', filter: 'blur(40px)' },
        }
      }
    },
  },
  plugins: [],
}
