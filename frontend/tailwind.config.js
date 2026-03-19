/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF7',
          100: '#FFF9E6',
          200: '#FFF3CC',
          300: '#FFECB3',
          400: '#FFE599',
          500: '#FFDD80',
        },
        amber: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        dark: {
          50: '#2A2520',
          100: '#252017',
          200: '#201B13',
          300: '#1B1610',
          400: '#16110C',
          500: '#110D09',
          600: '#0D0A07',
          700: '#0A0705',
          800: '#070503',
          900: '#040302',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 193, 7, 0.15)',
        'glow-lg': '0 0 40px rgba(255, 193, 7, 0.2)',
      },
    },
  },
  plugins: [],
}
