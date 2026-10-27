import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#FBF9F5',
        'sunrise-amber': '#D97736',
        'botanical-sage': '#5B7B6D',
        'soft-peach': '#F3BB91',
        'heading-ink': '#1A1D20',
        'velvet-obsidian': '#0B0F19',
        'twilight-slate': '#131A2B',
        'lavender-glow': '#818CF8',
        'cyan-atmosphere': '#38BDF8',
        'soft-white': '#F1F5F9',
        midnight: '#0B0F19',
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
          charcoal: '#1E1E24',
          mist: '#5C5C66',
          border: '#DCDAD2',
        }
      },
      fontFamily: {
        serif: [
          "'Playfair Display'",
          "'Cormorant Garamond'",
          "ui-serif",
          "Georgia",
          "Cambria",
          "'Times New Roman'",
          "Times",
          "serif"
        ],
        sans: [
          "'Plus Jakarta Sans'",
          "Inter",
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
        arabic: [
          "'Amiri'",
          "'Traditional Arabic'",
          "'Scheherazade New'",
          "'Tahoma'",
          "system-ui",
          "sans-serif"
        ]
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      transitionDuration: {
        'calm': '200ms',
        'slow-living': '800ms',
      },
      boxShadow: {
        'glow-indigo': '0 0 35px -5px rgba(99, 102, 241, 0.3)',
        'glow-peach': '0 0 35px -5px rgba(244, 63, 94, 0.25)',
        'glow-mint': '0 0 35px -5px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 40px -8px rgba(217, 119, 54, 0.35)',
        'glow-lavender': '0 0 40px -8px rgba(129, 140, 248, 0.35)',
        'glow-cyan': '0 0 40px -8px rgba(56, 189, 248, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;
