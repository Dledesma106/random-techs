import { forwardRef, useEffect, useState } from 'react';
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
            <View className="rounded-md h-12" style={style}>
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
                            'flex w-full rounded-md border border-input bg-background px-3 h-12 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
                            className,
                        )}
                        ref={ref}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
    onChange: (value: TValue | null) => void;
    onNavigate: () => void;
    addScreenListener: (setValue: (value: TValue, label: string) => void) => void;
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
    const {
        className,
        value,
        style,
        onChange,
        onNavigate,
        addScreenListener,
        placeholder,
        ...rest
    } = props;

    const [innerValue, setInnerValue] = useState(value);

    const handlePress = () => {
        addScreenListener((value, label) => {
            setInnerValue({
                value,
                label,
            });
        });

        onNavigate();
    };

    useEffect(() => {
        if (innerValue) {
            onChange(innerValue);
        } else {
            onChange(null);
        }
    }, [innerValue, onChange]);

    return (
        <Pressable style={style} onPress={handlePress}>
            <View
                ref={ref}
                className={cn(
                    'flex w-full rounded-md border border-input bg-background px-3 h-12 text-sm justify-center',
                    className,
                )}
            >
                {innerValue ? (
                    <Text {...rest}>{innerValue.label}</Text>
                ) : (
                    <Text className="text-muted-foreground" {...rest}>
                        {placeholder}
                    </Text>
                )}
            </View>
        </Pressable>
    );
});
