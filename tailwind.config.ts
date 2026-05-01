import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7851A9',
        secondary: '#b277d3',
        accent: '#19003a',
      },
      fontFamily: {
        sans: ['Georama', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
