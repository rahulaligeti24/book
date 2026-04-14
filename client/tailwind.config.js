/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mist: '#f8fafc',
        coral: '#f97316',
        teal: '#14b8a6',
        gold: '#f5b700'
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.12)'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(20, 184, 166, 0.28), transparent 35%), radial-gradient(circle at top right, rgba(249, 115, 22, 0.24), transparent 30%), linear-gradient(135deg, #fffaf5 0%, #effcfb 55%, #f8fafc 100%)'
      }
    }
  },
  plugins: []
};
