/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './App.{js,ts,jsx,tsx,mdx}'],
    darkMode: 'class',
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
                dark: {
                    background: 'rgb(15, 23, 42)',
                    foreground: 'rgb(247, 249, 251)',
                    primary: {
                        DEFAULT: 'rgb(59, 130, 246)',
                        foreground: 'rgb(255, 255, 255)',
                    },
                    secondary: {
                        DEFAULT: 'rgb(30, 41, 59)',
                        foreground: 'rgb(226, 232, 240)',
                    },
                    muted: {
                        DEFAULT: 'rgb(30, 41, 59)',
                        foreground: 'rgb(148, 163, 184)',
                    },
                    accent: {
                        DEFAULT: 'rgb(30, 41, 59)',
                        foreground: 'rgb(226, 232, 240)',
                    },
                    destructive: {
                        DEFAULT: 'rgb(248, 113, 113)',
                        foreground: 'rgb(255, 255, 255)',
                    },
                    card: {
                        DEFAULT: 'rgb(15, 23, 42)',
                        foreground: 'rgb(247, 249, 251)',
                    },
                },
            },
        },
    },
    plugins: [],
};
