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
        brand: {
          50:  '#e8f0fe',
          100: '#c5d8fc',
          200: '#93b8fb',
          300: '#5e96f8',
          400: '#3a7bf5',
          500: '#1a5cf0',
          600: '#1249d6',
          700: '#0d38b5',
          800: '#092991',
          900: '#051c6b',
        },
        neon: {
          blue:  '#00d4ff',
          green: '#00ff94',
          red:   '#ff3d71',
          gold:  '#ffd700',
          purple:'#bd00ff',
        },
        dark: {
          950: '#02040a',
          900: '#060c17',
          800: '#0a1628',
          700: '#0f2044',
          600: '#162d5c',
          500: '#1e3d78',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow':          'glow 2s ease-in-out infinite alternate',
        'ticker':        'ticker 30s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'slide-in-up':   'slideInUp 0.5s ease-out',
        'fade-in':       'fadeIn 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%':   { textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff' },
          '100%': { textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff' },
        },
        ticker: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideInUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
      boxShadow: {
        'neon-blue':   '0 0 20px rgba(0, 212, 255, 0.4)',
        'neon-green':  '0 0 20px rgba(0, 255, 148, 0.4)',
        'neon-red':    '0 0 20px rgba(255, 61, 113, 0.4)',
        'glass':       '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern':     "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300d4ff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
