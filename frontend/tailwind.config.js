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
        background: {
          DEFAULT: '#0B0F17',
          subtle: '#111726',
          card: '#161F30',
          hover: '#1D2A40',
        },
        border: {
          DEFAULT: '#222F46',
          subtle: '#1B263B',
          muted: '#2D3D58',
        },
        severity: {
          normal: {
            bg: 'rgba(148, 163, 184, 0.08)',
            border: 'rgba(148, 163, 184, 0.2)',
            text: '#94a3b8',
            badge: '#64748b',
          },
          info: {
            bg: 'rgba(56, 189, 248, 0.08)',
            border: 'rgba(56, 189, 248, 0.25)',
            text: '#38bdf8',
            badge: '#0284c7',
          },
          warning: {
            bg: 'rgba(245, 158, 11, 0.1)',
            border: 'rgba(245, 158, 11, 0.3)',
            text: '#fbbf24',
            badge: '#d97706',
          },
          high: {
            bg: 'rgba(249, 115, 22, 0.12)',
            border: 'rgba(249, 115, 22, 0.35)',
            text: '#fb923c',
            badge: '#ea580c',
          },
          critical: {
            bg: 'rgba(239, 68, 68, 0.14)',
            border: 'rgba(239, 68, 68, 0.4)',
            text: '#f87171',
            badge: '#dc2626',
          },
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
