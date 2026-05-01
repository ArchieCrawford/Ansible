/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(220 13% 91%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222 47% 11%)',
        muted: 'hsl(220 14% 96%)',
        'muted-foreground': 'hsl(220 9% 46%)',
        primary: 'hsl(222 47% 11%)',
        'primary-foreground': 'hsl(210 40% 98%)'
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
