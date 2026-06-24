/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/components/**/*.{js,vue,ts}',
    './src/domains/**/*.{js,vue,ts}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/plugins/**/*.{js,ts}',
    './src/app.vue',
  ],
  theme: {
    extend: {//tailwind generates utility classes names like bg-bg-canvas, text-text-base, border-border-hover, etc. based on the css variables defined in the :root selector in main.css file. These utility classes can be used in the project to apply the corresponding styles.
      colors: {
        accent: {
          DEFAULT: 'var(--color-accent)',
          alt: 'var(--color-accent-alt)',
          subtle: 'var(--color-accent-subtle)',
        },
        bg: {
          canvas: 'var(--color-bg-base)',
          card: 'var(--surface-bg-card)',
          input: 'var(--surface-bg-input)',
          'input-focus': 'var(--surface-bg-input-focus)',
          modal: 'var(--surface-bg-modal)',
        },
        text: {
          base: 'var(--color-text-base)',
          muted: 'var(--color-text-muted)',
        },
        border: {
          DEFAULT: 'var(--border-color)',
          hover: 'var(--border-hover-color)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          hover: 'var(--color-success-hover)',
          subtle: 'var(--color-success-subtle)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          hover: 'var(--color-danger-hover)',
          subtle: 'var(--color-danger-subtle)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          hover: 'var(--color-warning-hover)',
          subtle: 'var(--color-warning-subtle)',
        }
      },
      borderRadius: {
        sm: 'var(--radius-sm, 6px)',
        md: 'var(--radius-md, 10px)',
        lg: 'var(--radius-lg, 16px)',
      },
      boxShadow: {
        accent: '0 4px 12px var(--shadow-accent)',
        'accent-hover': '0 6px 16px var(--shadow-accent-hover)',
      }
    },
  },
  plugins: [],
}
