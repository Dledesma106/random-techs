import { forwardRef, useState } from 'react';
import {
    TextInput as NativeTextInput,
    Pressable,
    PressableProps,
    Text,
    TextInputProps,
    View,
} from 'react-native';

import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {}

export const TextInput = forwardRef<NativeTextInput, InputProps>(
    ({ className, style, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

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
                            'rounded-md border bg-background border-input py-3 px-3 ring-offset-background disabled:opacity-50',
                            className,
                        )}
                        style={{
                            fontSize: 14,
                            lineHeight: 17,
                        }}
                        ref={ref}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        placeholderTextColor="hsl(215.4 16.3% 46.9%)"
                        {...props}
                    />
                </View>
            </View>
        );
    },
);
TextInput.displayName = 'Input';

type InputFromOuterScreenProps<
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
