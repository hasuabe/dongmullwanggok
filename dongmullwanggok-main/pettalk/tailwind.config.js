/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FFF6EB',
          DEFAULT: '#F5E6D3',
          dark: '#E0CBB2',
        },
        accent: {
          DEFAULT: '#FF8A80',
          blue: '#81D4FA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#F8F9FA'
        },
        text: {
          DEFAULT: '#3E2723',
          light: '#5D4037'
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
