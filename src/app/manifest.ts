import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BECOMING — The Living Light Sanctuary',
    short_name: 'BECOMING',
    description: 'A quiet, private digital sanctuary for self-directed reflection and mindful micro-steps.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080F29',
    theme_color: '#080F29',
    icons: [
      {
        src: '/becoming-living-light-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
