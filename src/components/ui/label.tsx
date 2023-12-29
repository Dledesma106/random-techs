import { PropsWithChildren, forwardRef } from 'react';
import { Text } from 'react-native';

import { cn } from '@/lib/utils';

export type LabelProps = PropsWithChildren<Text['props']>;

const Label = forwardRef<Text, LabelProps>(({ className, ...props }, ref) => (
    <Text
        ref={ref}
        className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            className,
        )}
        {...props}
    />
));
Label.displayName = 'Label';

export { Label };
