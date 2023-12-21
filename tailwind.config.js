/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './App.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                destructive: {
                    DEFAULT: 'hsl(0 84.2% 60.2%)',
                    foreground: 'hsl(210 40% 98%)',
                },
                muted: {
                    DEFAULT: 'hsl(0 0% 90%)',
                    foreground: 'hsl(215.4 16.3% 46.9%)',
                },
                ring: 'hsl(222.2 84% 4.9%)',
                background: 'hsl(0 0% 100%)',
                foreground: 'hsl(222.2 84% 4.9%)',
                border: 'hsl(214.3 31.8% 91.4%)',
                input: '#e2e8f0',
                ring: 'hsl(222.2 84% 4.9%)',
            },
        },
    },
    plugins: [],
};
