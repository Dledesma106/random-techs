import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

type Item = {
    label: string;
    value: string;
};

type Props = {
    items: Item[];
    placeholder: string;
    value?: string;
    onValueChange: (value: string | null) => void;
    alwaysShowPlaceholder?: boolean;
};

const Dropdown: React.FC<Props> = ({
    items,
    placeholder,
    onValueChange,
    value,
    alwaysShowPlaceholder = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(value || null);

    const selectedItem = items.find((item) => item.value === selectedValue);

    const handleSelect = (item: Item) => {
        if (!alwaysShowPlaceholder) {
            setSelectedValue(item.value);
        }
        onValueChange(item.value);
        setIsOpen(false);
    };

    return (
        <View className="relative">
            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                className="flex-row items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
                <Text className="text-base text-gray-700">
                    {alwaysShowPlaceholder
                        ? placeholder
                        : selectedItem
                          ? selectedItem.label
                          : placeholder}
                </Text>
                <AntDesign name="down" size={16} color="gray" />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/50"
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View className="flex-1 justify-center items-center px-4">
                        <View className="w-full bg-white rounded-lg max-h-[80%]">
                            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                                <Text className="text-lg font-medium">{placeholder}</Text>
                                <TouchableOpacity onPress={() => setIsOpen(false)}>
                                    <AntDesign name="close" size={24} color="gray" />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={items}
                                keyExtractor={(item) => item.value}
                                className="max-h-[300px]"
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(item)}
                                        className={`p-4 border-b border-gray-100 ${
                                            !alwaysShowPlaceholder &&
                                            selectedValue === item.value
                                                ? 'bg-gray-50'
                                                : ''
                                        }`}
                                    >
                                        <Text className="text-base text-gray-700">
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default Dropdown;
