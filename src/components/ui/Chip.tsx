import { EvilIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
    label: string;
    onCrossPress?: () => void;
};

const Chip = ({ label, onCrossPress }: Props) => {
    return (
        <View className="rounded-full items-center px-2 pb-2 flex-row gap-2 m-1 bg-slate-300">
            <Text>{label}</Text>
            {onCrossPress && (
                <TouchableOpacity onPress={onCrossPress}>
                    <EvilIcons name="close" size={12} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Chip;
