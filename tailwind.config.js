/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e4ebe4',
          200: '#c9d7c9',
          300: '#a3b8a3',
          400: '#7a967a',
          500: '#5a7a5a',
          600: '#466146',
          700: '#394e39',
          800: '#2f3f2f',
          900: '#283528',
        },
        calm: {
          50: '#f0f7fa',
          100: '#daeaf2',
          200: '#b9d7e6',
          300: '#8bbdd4',
          400: '#5a9cb8',
          500: '#3d809c',
          600: '#346783',
          700: '#2f546b',
          800: '#2c4759',
          900: '#283c4b',
        },
        warm: {
          50: '#faf8f5',
          100: '#f3ede4',
          200: '#e6d9c8',
          300: '#d4bfa5',
          400: '#c0a07e',
          500: '#b08862',
          600: '#a37456',
          700: '#875e48',
          800: '#6f4e3f',
          900: '#5b4136',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(44, 71, 89, 0.12)',
        card: '0 2px 12px -2px rgba(44, 71, 89, 0.08)',
      },
    },
  },
  plugins: [],
}
