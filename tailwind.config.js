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
        gray1: '#5E5565',
        gray2: '#AEA7B3',
        gray3: '#D6CFDA',
        font: '#1F102A',
      },
      screens: {
        xxs: '310px',
        xs: '380px',
      },
    },
  },
  plugins: [],
}
