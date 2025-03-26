import { forwardRef, useState } from 'react';
import {
    TextInput as NativeTextInput,
    Pressable,
    PressableProps,
    StyleProp,
    Text,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';

import useThemeColors from '@/hooks/useThemeColors';
import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {
    inputStyle?: StyleProp<TextStyle>;
    icon?: JSX.Element;
    onIconPress?: () => void;
}

export const TextInput = forwardRef<NativeTextInput, InputProps>(
    ({ className, style, inputStyle, onBlur, icon, onIconPress, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const {
            colors: { accent, border },
            bgBackground,
        } = useThemeColors();
        const handleFocus = () => setIsFocused(true);
        const handleBlur: InputProps['onBlur'] = (e) => {
            setIsFocused(false);

            if (onBlur) {
                onBlur(e);
            }
        };

        return (
            <View className="rounded-md" style={style}>
                <View
                    className="rounded-md"
                    style={[
                        {
                            borderWidth: 2,
                            margin: -4,
                            padding: 2,
                        },
                        isFocused
                            ? {
                                  borderColor: '#000',
                              }
                            : {
                                  borderColor: 'transparent',
                              },
                    ]}
                >
                    <NativeTextInput
                        className={cn(
                            'rounded-md border py-3 px-3 disabled:opacity-50',
                            className,
                            `border-[${border}]`,
                            `bg-[${bgBackground}]`,
                            `ring-offset-[${accent}]`,
                        )}
                        style={[{ fontSize: 14, lineHeight: 17 }, inputStyle]}
                        ref={ref}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        placeholderTextColor="hsl(215.4 16.3% 46.9%)"
                        {...props}
                    />
                    {icon && (
                        <TouchableOpacity
                            onPress={onIconPress}
                            disabled={!onIconPress}
                            className="absolute right-4 top-4"
                        >
                            {icon}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    },
);
TextInput.displayName = 'Input';

type InputFromOuterScreenProps<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TValue extends Record<string, any> | number | string | boolean | unknown = unknown,
> = {
    style?: PressableProps['style'];
    className?: string;
    placeholder?: string;
    value?: {
        value: TValue;
        label: string;
    } | null;
    onNavigate: () => void;
};

interface WithForwardRefType extends React.FC<InputFromOuterScreenProps<unknown>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TValue extends Record<string, any> | number | string | boolean | unknown = unknown>(
        props: InputFromOuterScreenProps<TValue>,
    ): ReturnType<React.FC<InputFromOuterScreenProps<TValue>>>;
}

export const InputFromOuterScreen: WithForwardRefType = forwardRef<
    View,
    InputFromOuterScreenProps
>((props: InputFromOuterScreenProps, ref) => {
    const { className, value, style, onNavigate, placeholder, ...rest } = props;

    const handlePress = () => {
        onNavigate();
    };

    return (
        <Pressable style={style} onPress={handlePress}>
            <View
                ref={ref}
                className={cn(
                    'flex w-full rounded-md border border-input bg-background py-3 px-3 min-h-12 text-sm justify-center',
                    className,
                )}
            >
                {value ? (
                    <Text {...rest}>{value.label}</Text>
                ) : (
                    <Text className="text-muted-foreground" {...rest}>
                        {placeholder}
                    </Text>
                )}
            </View>
        </Pressable>
    );
});
