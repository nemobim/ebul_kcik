/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Galmuri', 'sans-serif'],
      },
      animation: {
        slowPing: 'ping 2s linear infinite', // 2초로 변경
      },
      colors: {
        main1: '#FCEF8D',
        main2: '#5B5BEC',
        main3: '#EA6262',
        gray1: '#6B7588',
        gray2: '#B2BACB',
        gray3: '#DBE1ED',
        font: '#1F102A',
      },
    },
  },
  plugins: [],
}
