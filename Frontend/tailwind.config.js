module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            spacing: {
                '128': '32rem',
            },
            width: {
                '128': '32rem',
                '144': '36rem',
                '160': '40rem',
                '192': '48rem',
                '224': '56rem',
            },
            height: {
                '128': '32rem',
                '144': '36rem',
                '160': '40rem',
                '192': '48rem',
                '224': '56rem',
            },
            borderWidth: {
                '0.05r': '0.05rem',
                '1.5': '1.5px',
                '0.25r': '0.25rem',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('daisyui'),
    ],
    daisyui: {
        themes: [

            "light",
            "dark",
             "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "black",
            "luxury",
            "dracula",
            "cmyk",
            "autumn",
            "business",
            "acid",
            "lemonade",
            "night",
            "coffee",
            "winter",
            "dim",
            "nord",
            "sunset",
        ],
    },
}