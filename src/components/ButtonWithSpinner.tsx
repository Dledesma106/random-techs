import { ActivityIndicator, View } from 'react-native';

import { Button, ButtonProps, ButtonText } from './ui/button';

import { cn } from '@/lib/utils';

type Props = Omit<ButtonProps, 'children'> & {
    spinnerProps?: React.SVGProps<SVGSVGElement>;
    showSpinner?: boolean;
    children: string;
};

export const ButtonWithSpinner = ({
    showSpinner,
    children,
    className,
    ...props
}: Props) => (
    <Button className={cn(className, 'relative')} {...props}>
        <ButtonText className={cn(showSpinner && 'opacity-0')}>{children}</ButtonText>

        {showSpinner && (
            <View className="absolute inset-0 flex items-center justify-center">
                <ActivityIndicator />
            </View>
        )}
    </Button>
);
