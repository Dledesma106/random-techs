import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import {
    Pressable,
    PressableProps,
    Text,
    TextProps,
    View,
    ViewStyle,
} from 'react-native';

import { colorRgba } from '@/lib/styles';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center bg-primary justify-center whitespace-nowrap rounded-md transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-input bg-background',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

const buttonTextVariants = cva('text-sm font-medium', {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            destructive: 'text-destructive-foreground',
            outline: '',
            secondary: 'text-secondary-foreground',
            ghost: 'text-accent-foreground',
            link: 'text-primary underline-offset-4',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

type ButtonVariantsProps = VariantProps<typeof buttonVariants>;

type PressedStyles = Record<
    Exclude<ButtonVariantsProps['variant'], null | undefined>,
    ViewStyle
>;

const pressedStyles: PressedStyles = {
    default: {
        // backgroundColor: colorRgba('primary', 0.9),
    },
    destructive: {
        backgroundColor: colorRgba('destructive', 0.9),
    },
    outline: {
        backgroundColor: colorRgba('accent', 1),
    },
    secondary: {
        backgroundColor: colorRgba('secondary', 0.8),
    },
    ghost: {
        backgroundColor: colorRgba('accent', 0.9),
    },
    link: {
        backgroundColor: colorRgba('primary', 0.9),
    },
};

export interface ButtonProps extends Omit<PressableProps, 'style'>, ButtonVariantsProps {
    style?: ViewStyle;
}

type ButtonContextData = {
    variant?: ButtonProps['variant'];
};

const ButtonContext = React.createContext<ButtonContextData>({});

const Button = React.forwardRef<View, ButtonProps>((props, ref) => {
    const {
        className,
        variant = 'default',
        size,
        onPress,
        style,
        children,
        ...rest
    } = props;

    const [pressed, setPressed] = React.useState(false);
    const composedStyle: PressableProps['style'] = [
        style,
        pressed ? pressedStyles[variant || 'default'] : {},
        props.disabled ? { opacity: 0.5 } : {},
    ];

    return (
        <ButtonContext.Provider value={{ variant }}>
            <Pressable
                onPress={onPress}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                className={cn(
                    buttonVariants({
                        variant,
                        size,
                        className,
                    }),
                )}
                style={composedStyle}
                ref={ref}
                {...rest}
            >
                {children}
            </Pressable>
        </ButtonContext.Provider>
    );
});
Button.displayName = 'Button';

const useButtonContext = () => React.useContext(ButtonContext);

const ButtonText = React.forwardRef<View, TextProps>((props, ref) => {
    const { variant } = useButtonContext();

    return (
        <Text
            className={cn(
                buttonTextVariants({
                    variant,
                }),
            )}
            ref={ref}
            {...props}
        />
    );
});

export { Button, ButtonText, buttonVariants };
