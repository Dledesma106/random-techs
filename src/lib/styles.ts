const colors = {
    background: {
        DEFAULT: 'rgb(255, 255, 255)',
        foreground: 'rgb(255, 255, 255)',
    },
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
} as const;

export const colorRgba = (
    color: keyof typeof colors,
    opacity: number,
    variant: 'DEFAULT' | 'foreground' = 'DEFAULT',
) => {
    const rgbString = colors[color][variant];
    return rgbString.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
};
