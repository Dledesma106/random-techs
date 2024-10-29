import { View, Text } from 'react-native';

type HeaderProps = {
    title: string;
    description?: string;
};

const Header = ({ title, description }: HeaderProps) => {
    return (
        <View className="flex flex-column items-center justify-between px-4 mb-4">
            <Text className="font-bold text-lg">{title}</Text>
            <Text>{description}</Text>
        </View>
    );
};

export default Header;
