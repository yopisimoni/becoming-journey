import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF7',
          100: '#FAF7EE',
          200: '#F4EEDB',
          300: '#EAE1C4',
          800: '#3A3831',
          900: '#1F1E1A',
        },
        violet: {
          soft: '#EBE7F5',
          muted: '#8B7FB8',
          deep: '#3D3457',
        },
        mint: {
          soft: '#E6F4EA',
          muted: '#5A9E74',
          deep: '#234932',
        },
        peach: {
          soft: '#FDECE7',
          muted: '#D97A60',
          deep: '#5C2D20',
        },
        stone: {
          charcoal: '#242426',
          mist: '#6C6C75',
          border: '#E3E1DA',
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
          "'Apple Color Emoji'",
          "'Segoe UI Emoji'",
          "'Segoe UI Symbol'"
        ],
      },
      transitionDuration: {
        'calm': '200ms',
      },
    },
  },
  plugins: [],
};
export default config;
