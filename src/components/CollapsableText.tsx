import { useState } from 'react';
import { Text, View } from 'react-native';
import Collapsible from 'react-native-collapsible';

import { Button, ButtonText } from './ui/button';

export default function CollapsableText({
    buttonText,
    text,
}: {
    buttonText: string;
    text: string;
}) {
    const [collapsed, setCollapsed] = useState(true);
    return (
        <View className="m-2">
            <Button onPress={() => setCollapsed(!collapsed)}>
                <ButtonText>
                    {collapsed ? `Mostrar ${buttonText}` : `Ocultar ${buttonText}`}
                </ButtonText>
            </Button>
            <Collapsible collapsed={collapsed}>
                <Text>{text}</Text>
            </Collapsible>
        </View>
    );
}
