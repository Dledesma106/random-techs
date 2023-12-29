import * as React from 'react';
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    useFormContext,
} from 'react-hook-form';
import { Text, TextProps, View, ViewProps } from 'react-native';

import { Label, LabelProps } from './label';

import { cn } from '@/lib/utils';

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = React.createContext<
    FormFieldContextValue & {
        style?: ViewProps['style'];
    }
>({} as FormFieldContextValue);

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    style,
    ...props
}: ControllerProps<TFieldValues, TName> & {
    style?: ViewProps['style'];
}) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name, style }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { formState } = useFormContext();

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>');
    }

    if (!itemContext) {
        throw new Error('useFormField should be used within <FormItem>');
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        style: fieldContext.style,
        error: formState.errors[fieldContext.name],
    };
};

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue,
);

const FormItem = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => {
    const id = React.useId();
    const fieldContext = React.useContext(FormFieldContext);

    return (
        <FormItemContext.Provider value={{ id: id }}>
            <View
                ref={ref}
                style={fieldContext.style}
                className={cn('space-y-2', className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<Text, LabelProps>(({ className, ...props }, ref) => {
    const { error } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(error && 'text-destructive', className)}
            {...props}
        />
    );
});
FormLabel.displayName = 'FormLabel';

const FormDescription = React.forwardRef<Text, TextProps>(
    ({ className, ...props }, ref) => {
        const { formDescriptionId } = useFormField();

        return (
            <Text
                ref={ref}
                id={formDescriptionId}
                className={cn('text-sm text-muted-foreground', className)}
                {...props}
            />
        );
    },
);
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<Text, TextProps>(
    ({ className, children, ...props }, ref) => {
        const { error, formMessageId } = useFormField();
        const body = error ? String(error?.message) : children;

        if (!body) {
            return null;
        }

        return (
            <Text
                ref={ref}
                id={formMessageId}
                className={cn('text-sm font-medium text-destructive', className)}
                {...props}
            >
                {body}
            </Text>
        );
    },
);
FormMessage.displayName = 'FormMessage';

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
    FormField,
};
