import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Text, TextProps, View } from 'react-native';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 transition-colors',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary hover:bg-primary/80',
                secondary: 'border-transparent bg-secondary hover:bg-secondary/80',
                destructive: 'border-transparent bg-destructive hover:bg-destructive/80',
                outline: '',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const badgeTextVariants = cva('text-xs font-semibold', {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            secondary: 'text-secondary-foreground',
            destructive: 'text-destructive-foreground',
            outline: 'text-foreground',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

export interface BadgeProps extends TextProps, VariantProps<typeof badgeVariants> {}

type BadgeContextData = {
    variant?: BadgeProps['variant'];
};

const BadgeContext = React.createContext<BadgeContextData>({});

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <BadgeContext.Provider value={{ variant }}>
            <View
                className={cn(
                    badgeVariants({
                        variant,
                    }),
                    className,
                )}
                {...props}
            />
        </BadgeContext.Provider>
    );
}

const BadgeText = ({ className, ...props }: TextProps) => {
    const { variant } = React.useContext(BadgeContext);

    return (
        <Text
            className={cn(
                badgeTextVariants({
                    variant,
                }),
                className,
            )}
            {...props}
        />
    );
};

export { Badge, BadgeText, badgeVariants };
