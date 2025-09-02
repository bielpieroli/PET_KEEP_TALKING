/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
      },
      animation: {
        'pulse-danger': 'pulse-danger 1s ease-in-out infinite',
        'flash-warning': 'flash-warning 0.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-danger': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'flash-warning': {
          '0%, 50%': { backgroundColor: 'var(--primary)' },
          '51%, 100%': { backgroundColor: 'var(--secondary)' },
        }
      }
    },
  },
  plugins: [],
}