/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C2541',
        paper: '#FAF7F0',
        paperDim: '#F1ECE0',
        mustard: '#E3A72A',
        forest: '#3B6E52',
        brick: '#B5482A',
        line: '#DDD6C7',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, #DDD6C7 1px, transparent 1px)',
      },
      backgroundSize: {
        dots: '18px 18px',
      },
    },
  },
  plugins: [],
}
