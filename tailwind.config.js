// E:/.../resolveai-frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'orange-energia': '#f57c00',
        'grafite-profundo': '#212121',
        'cinza-neutro': '#9e9e9e',
        'light-bg': '#f4f4f5',
        'white': '#ffffff',
        'success': '#4caf50', 
        'error': '#f44336',   
        'info': '#2196f3',    
        'warning': '#ff9800'
      }
    },
  },
  plugins: [],
}