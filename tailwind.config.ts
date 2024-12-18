import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        'shark': {
          '50': '#f3f7f8',
          '100': 'var(--foreground)',
          '200': '#c6d4db',
          '300': '#9eb6c2',
          '400': '#6f8fa1',
          '500': '#547486',
          '600': '#486172',
          '700': '#3f515f',
          '800': '#394651',
          '900': '#333d46',
          '950': 'var(--background)',
        },

        'apple': {
          '50': '#effef1',
          '100': '#dafedf',
          '200': '#b7fbc1',
          '300': '#7ff692',
          '400': '#40e85b',
          '500': '#15bc31',
          '600': '#0dac28',
          '700': '#0e8723',
          '800': '#116a21',
          '900': '#10571e',
          '950': '#02310d',
        },

        'orange': {
          '50': '#fffaec',
          '100': '#fff4d3',
          '200': '#ffe5a5',
          '300': '#ffd16d',
          '400': '#ffb232',
          '500': '#ff980a',
          '600': '#ff8000',
          '700': '#cc5d02',
          '800': '#a1480b',
          '900': '#823d0c',
          '950': '#461d04',
        },

        'blue': {
          '50': '#f0f9ff',
          '100': '#e1f2fd',
          '200': '#bbe6fc',
          '300': '#80d2f9',
          '400': '#40bcf4',
          '500': '#13a2e4',
          '600': '#0682c3',
          '700': '#06679e',
          '800': '#0a5882',
          '900': '#0e496c',
          '950': '#092f48',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
