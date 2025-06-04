/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        dark: {
          bg: '#0A0F1C',
          card: '#151B30',
          border: '#1F2A48',
          hover: '#1D2842',
          accent: '#2A3558',
          text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
            accent: '#60A5FA'
          }
        }
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(to bottom right, #0A0F1C, #151B30)',
        'dark-glow': 'radial-gradient(circle at center, rgba(96, 165, 250, 0.15), transparent 80%)',
      },
      boxShadow: {
        'dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
};