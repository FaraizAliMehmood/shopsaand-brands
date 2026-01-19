/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#4fbf8b',
        'primary-dull': '#44ae7c',
        secondary: '#87636B',
        success: '#00A13A',
        error: '#FF0000',
        warning: '#FFA500',
        info: '#0077FF',
        black: '#000000',
        white: '#FFFFFF',
        gray50: '#F9FAFB',
        gray100: '#EFF0F6',
        gray200: '#CCCCCC',
        gray300: '#9E9E9E',
        gray400: '#666666',
        gray500: '#454545',
        gray600: '#2C2C2C',
        gray700: '#1A1A1A',
        'black-opacity-60': 'rgba(0, 0, 0, 0.6)',
        'white-opacity-60': 'rgba(255, 255, 255, 0.6)',
        transparent: 'transparent',
        'rare-badge': '#B19CD9',
        'size-button-border': '#E5E5E5',
        'size-button-selected': '#000000',
        'quantity-button': '#F5F5F5',
        'share-button': '#000000',
      },
    },
  },
  plugins: [],
}
