// tailwind.config.js
import path from 'path'; // Adicione esta linha no topo

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Usamos path.resolve para criar caminhos absolutos e inequívocos
    path.resolve(__dirname, './index.html'),
    path.resolve(__dirname, './src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}