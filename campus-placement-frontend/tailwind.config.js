/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#080B12',
          900: '#0B0F19',
          800: '#111726',
          700: '#181F33',
          600: '#232C46',
        },
        signal: {
          violet: '#6C5CE7',
          violetSoft: '#8B7FF0',
          teal: '#00D9C0',
          amber: '#FFB020',
          coral: '#FF5B6B',
        },
        mist: {
          100: '#F5F6FA',
          300: '#C4C9D8',
          500: '#8B93A7',
          700: '#5B6376',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-glow':
          'radial-gradient(circle at 20% -10%, rgba(108,92,231,0.25), transparent 45%), radial-gradient(circle at 100% 10%, rgba(0,217,192,0.14), transparent 40%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(108,92,231,0.45)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
