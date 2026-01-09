/** @type {import('tailwindcss').Config} */
import nativewindPreset from 'nativewind/preset';

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        border: 'var(--color-border)',
        card: 'var(--color-card)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
    },
  },
  plugins: [],
}
