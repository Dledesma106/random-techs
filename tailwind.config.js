/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './App.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                ring: 'rgb(1, 8, 22)',
                background: 'rgb(255, 255, 255)',
                foreground: 'rgb(1, 8, 22)',
                border: 'rgb(229, 231, 235)',
                input: 'rgb(226, 232, 240)',
                primary: {
                    DEFAULT: 'rgb(15, 23, 42)',
                    foreground: 'rgb(247, 249, 251)',
                },
                secondary: {
                    DEFAULT: 'rgb(241, 245, 249)',
                    foreground: 'rgb(15, 23, 42)',
                },
                destructive: {
                    DEFAULT: 'rgb(238, 68, 68)',
                    foreground: 'rgb(247, 249, 251)',
                },
                muted: {
                    DEFAULT: 'rgb(241, 245, 249)',
                    foreground: 'rgb(100, 116, 139)',
                },
                accent: {
                    DEFAULT: 'rgb(241, 245, 249)',
                    foreground: 'rgb(15, 23, 42)',
                },
                card: {
                    DEFAULT: 'rgb(255, 255, 255)',
                    foreground: 'rgb(1, 8, 22)',
                },
            },
        },
    },
    plugins: [],
};
