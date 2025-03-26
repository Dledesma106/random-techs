import { useColorScheme } from 'nativewind';

// Definimos las clases de Tailwind para el tema claro
const lightClasses = {
    // Fondos
    bgBackground: 'bg-[#dedede]',
    bgBackgroundPrimary: 'bg-[#c3e3db]',
    bgPrimary: 'bg-[#121c2d]',
    bgSecondary: 'bg-[#f2f7fc]',
    bgMuted: 'bg-[#f2f7fc]',
    bgAccent: 'bg-[#73c9b4]',
    bgDestructive: 'bg-[#ef4444]',
    bgCard: 'bg-[#ffffff]',
    bgPopover: 'bg-[#ffffff]',
    bgSkeleton: 'bg-[#e2e8f0]',

    // Textos
    textForeground: 'text-[#2f3031]',
    textPrimary: 'text-[#f1faff]',
    textSecondary: 'text-[#121c2d]',
    textMuted: 'text-[#404b5f]',
    textAccent: 'text-[#404040]',
    textDestructive: 'text-[#f1faff]',
    textCard: 'text-[#020917]',
    textPopover: 'text-[#020917]',
    textSkeletonForeground: 'text-[#e2e8f0]',

    // Bordes
    border: 'border-[#e5e9ef]',

    // Otros
    ring: 'ring-[#020917]',
    input: 'bg-[#e5e9ef]',

    // Colores directos (para estilos personalizados)
    colors: {
        background: '#dedede',
        backgroundPrimary: '#c3e3db',
        foreground: '#2f3031',

        border: '#e5e9ef',
        input: '#e5e9ef',
        ring: '#020917',

        card: {
            DEFAULT: '#ffffff',
            foreground: '#020917',
        },

        popover: {
            DEFAULT: '#ffffff',
            foreground: '#020917',
        },

        primary: {
            DEFAULT: '#121c2d',
            foreground: '#f1faff',
        },

        secondary: {
            DEFAULT: '#f2f7fc',
            foreground: '#121c2d',
        },

        muted: {
            DEFAULT: '#f2f7fc',
            foreground: '#404b5f',
        },

        accent: {
            DEFAULT: '#73c9b4',
            foreground: '#404040',
        },

        destructive: {
            DEFAULT: '#ef4444',
            foreground: '#f1faff',
        },

        skeleton: {
            DEFAULT: '#e2e8f0',
            foreground: '#e2e8f0',
        },

        radius: '0.5rem',
    },
};

// Definimos las clases de Tailwind para el tema oscuro
const darkClasses = {
    // Fondos
    bgBackground: 'bg-[#2f3031]',
    bgBackgroundPrimary: 'bg-[#0e3026]',
    bgPrimary: 'bg-[#f1faff]',
    bgSecondary: 'bg-[#233144]',
    bgMuted: 'bg-[#233144]',
    bgAccent: 'bg-[#194033]',
    bgDestructive: 'bg-[#88201c]',
    bgCard: 'bg-[#020917]',
    bgPopover: 'bg-[#020917]',
    bgSkeleton: 'bg-[#222e3d]',

    // Textos
    textForeground: 'text-[#dedede]',
    textPrimary: 'text-[#121c2d]',
    textSecondary: 'text-[#f1faff]',
    textMuted: 'text-[#aabbcc]',
    textAccent: 'text-[#ffffff]',
    textDestructive: 'text-[#f1faff]',
    textCard: 'text-[#f1faff]',
    textPopover: 'text-[#f1faff]',
    textSkeletonForeground: 'text-[#222e3d]',

    // Bordes
    border: 'border-[#233144]',

    // Otros
    ring: 'ring-[#bad2eb]',
    input: 'bg-[#233144]',

    // Colores directos (para estilos personalizados)
    colors: {
        background: '#2f3031',
        backgroundPrimary: '#0e3026',
        foreground: '#dedede',

        border: '#233144',
        input: '#233144',
        ring: '#bad2eb',

        card: {
            DEFAULT: '#020917',
            foreground: '#f1faff',
        },

        popover: {
            DEFAULT: '#020917',
            foreground: '#f1faff',
        },

        primary: {
            DEFAULT: '#4AA190',
            foreground: '#f1faff',
        },

        secondary: {
            DEFAULT: '#233144',
            foreground: '#f1faff',
        },

        muted: {
            DEFAULT: '#233144',
            foreground: '#aabbcc',
        },

        accent: {
            DEFAULT: '#194033',
            foreground: '#ffffff',
        },

        destructive: {
            DEFAULT: '#88201c',
            foreground: '#f1faff',
        },

        skeleton: {
            DEFAULT: '#222e3d',
            foreground: '#222e3d',
        },

        radius: '0.5rem',
    },
};

// Tipo para las clases del tema
export type ThemeClasses = typeof lightClasses;

/**
 * Hook personalizado que devuelve las clases de Tailwind según el tema actual
 * @returns Un objeto con las clases de Tailwind y los colores del tema actual
 */
export const useThemeColors = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Devolvemos las clases según el tema actual
    return {
        ...(isDark ? darkClasses : lightClasses),
        isDark,
        colorScheme,
    };
};

export default useThemeColors;
