/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        horizon: {
          950: '#04060A',
          900: '#080C16',
          850: '#0C1222',
          800: '#111A30',
          700: '#1B2644',
          600: '#273862',
          orange: '#FF7A29',
          orangeHover: '#FF5E13',
          orangeGlow: 'rgba(255, 122, 41, 0.35)',
          amber: '#F59E0B',
          cyan: '#38BDF8',
          emerald: '#10B981',
          rose: '#F43F5E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-orange': '0 0 25px -3px rgba(255, 122, 41, 0.35)',
        'glow-orange-lg': '0 0 45px -5px rgba(255, 122, 41, 0.45)',
        'glow-cyan': '0 0 25px -3px rgba(56, 189, 248, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
