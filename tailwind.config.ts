import type { Config } from 'tailwindcss';

// The palette mirrors the printed workbook: warm orange headers, yellow/beige
// tables and light-green answer fields. See docs/DESIGN.md for the rationale.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        heft: {
          orange: '#f97316',
          'orange-dark': '#ea580c',
          yellow: '#fde68a',
          beige: '#fef3c7',
          green: '#bbf7d0',
          'green-dark': '#4ade80',
          hand: '#1d4ed8', // hour hand (blue)
          minute: '#dc2626', // minute hand (red)
          second: '#f59e0b', // second hand (amber)
        },
      },
      fontFamily: {
        // System fonts only – no external font is loaded (privacy + offline).
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
