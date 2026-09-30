/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FCFAF4',
        cream: '#F7EEDB',
        sand: '#EDE5D0',
        ink: '#20201D',
        'ink-light': '#6B6B66',
        'ink-faint': '#9B9B96',
        green: {
          DEFAULT: '#30D565',
          hover: '#28C05A',
          light: '#E8F9EE',
        },
        border: '#E5DFD0',
        'border-light': '#EFEBE0',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'pill': '9999px',
        'card': '16px',
        'section': '40px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(32, 32, 29, 0.06)',
        'card': '0 2px 8px 0 rgba(32, 32, 29, 0.08)',
        'card-hover': '0 8px 24px 0 rgba(32, 32, 29, 0.12)',
        'modal': '0 25px 50px -12px rgba(32, 32, 29, 0.25)',
      },
      fontSize: {
        'hero': ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'section': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
