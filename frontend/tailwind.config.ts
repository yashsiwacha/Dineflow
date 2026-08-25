import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          charcoal: {
            DEFAULT: '#111111',
            light: '#1E1E1E',
            muted: '#2A2A2A'
          },
          cream: {
            DEFAULT: '#FAF7F2',
            dark: '#F4EFE6',
            light: '#FCFAF7'
          },
          terracotta: {
            DEFAULT: '#B45309',
            dark: '#78350F',
            light: '#D97706'
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F3E5AB'
          }
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
export default config
