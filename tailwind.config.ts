import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { 50: '#FEFDFB', 100: '#FDFBF5', 200: '#FAF6E8', 300: '#F5EDD0' },
        forest: { 50: '#F0F7F4', 100: '#D8EBE0', 200: '#B3D7C1', 300: '#7DB99A', 400: '#4A9B73', 500: '#2D7A56', 600: '#1F5C3F', 700: '#174530', 800: '#103222', 900: '#0A2118' },
        lime: { 50: '#F7FEE7', 100: '#ECFDCC', 200: '#D9F99D', 300: '#BEF264', 400: '#A3E635', 500: '#84CC16', 600: '#65A30D' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
