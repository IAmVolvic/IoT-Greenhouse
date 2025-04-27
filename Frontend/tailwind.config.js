import { main } from './src/assets/tailwind/pallet'

module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            spacing: {
                '128': '32rem'
            },
            width: {
                '128': '32rem',
                '144': '36rem',
                '160': '40rem',
                '192': '48rem',
                '224': '56rem'
            },
            height: {
                '128': '32rem',
                '144': '36rem',
                '160': '40rem',
                '192': '48rem',
                '224': '56rem'
            },
            borderWidth: {
                '0.05r': '0.05rem',
                '1.5': '1.5px',
                '0.25r': '0.25rem'
            },
            colors: {
                  ...main,
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}