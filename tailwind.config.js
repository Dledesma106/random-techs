/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './App.{js,ts,jsx,tsx,mdx}'],
    darkMode: 'class',
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--background))',
                foreground: 'rgb(var(--foreground))',
                border: 'rgb(var(--border))',
                input: 'rgb(var(--input))',
                ring: 'rgb(var(--ring))',
                primary: {
                    DEFAULT: 'rgb(var(--primary))',
                    foreground: 'rgb(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary))',
                    foreground: 'rgb(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'rgb(var(--destructive))',
                    foreground: 'rgb(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'rgb(var(--muted))',
                    foreground: 'rgb(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent))',
                    foreground: 'rgb(var(--accent-foreground))',
                },
                card: {
                    DEFAULT: 'rgb(var(--card))',
                    foreground: 'rgb(var(--card-foreground))',
                },
            },
        },
    },
    plugins: [
        function({ addBase }) {
            addBase({
                ':root': {
                    '--background': '255 255 255',
                    '--foreground': '10 10 10',
                    '--border': '229 231 235',
                    '--input': '229 231 235',
                    '--ring': '147 163 180',
                    '--primary': '10 10 10',
                    '--primary-foreground': '248 250 252',
                    '--secondary': '241 245 249',
                    '--secondary-foreground': '10 10 10',
                    '--destructive': '255 0 0',
                    '--destructive-foreground': '248 250 252',
                    '--muted': '241 245 249',
                    '--muted-foreground': '100 116 139',
                    '--accent': '241 245 249',
                    '--accent-foreground': '10 10 10',
                    '--card': '255 255 255',
                    '--card-foreground': '10 10 10',
                },
                '.dark': {
                    '--background': '30 41 59',
                    '--foreground': '226 232 240',
                    '--border': '51 65 85',
                    '--input': '51 65 85',
                    '--ring': '51 65 85',
                    '--primary': '248 250 252',
                    '--primary-foreground': '15 23 42',
                    '--secondary': '30 41 59',
                    '--secondary-foreground': '248 250 252',
                    '--destructive': '239 68 68',
                    '--destructive-foreground': '248 250 252',
                    '--muted': '51 65 85',
                    '--muted-foreground': '148 163 184',
                    '--accent': '51 65 85',
                    '--accent-foreground': '248 250 252',
                    '--card': '30 41 59',
                    '--card-foreground': '226 232 240',
                },
            });
        },
    ],
};
