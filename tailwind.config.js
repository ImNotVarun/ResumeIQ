/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: '#F5C842',
        secondary: '#C4B5FD',
        accent: '#FDE68A',
        dark: '#1A1A2E',
        'light-dark': '#2D2D2D',
        card: '#FFFFFF',
        muted: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #C4B5FD 0%, #FDE68A 100%)',
      },
    },
  },
  plugins: [],
};
