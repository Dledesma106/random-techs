import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';

interface ConfirmButtonProps {
    title: string;
    confirmTitle: string;
    confirmText?: string;
    onConfirm: () => void;
    icon: JSX.Element;
    className?: string;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
    title,
    confirmTitle,
    confirmText,
    onConfirm,
    icon,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const handleConfirm = () => {
        setModalVisible(false);
        onConfirm();
    };

    return (
        <View className="absolute bottom-1 w-screen">
            <View className="pb-4 px-4 relative">
                <Pressable
                    onPress={() => setModalVisible(true)}
                    className="p-4 rounded-full bg-black justify-center items-center flex flex-row space-x-1"
                >
                    <Text className="font-semibold text-white">{title}</Text>
                    {icon}
                </Pressable>
            </View>
            <Modal
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                backdropOpacity={1}
                customBackdrop={
                    <BlurView
                        style={StyleSheet.absoluteFill}
                        intensity={50}
                        tint="light"
                    />
                }
            >
                <View className="flex flex-column justify-center gap-4 p-6 rounded-lg items-center bg-background border-border relative left-1">
                    <Text className="font-bold text-lg text-center">{confirmTitle}</Text>
                    <Text className="text-center text-sm text-gray-500">
                        {confirmText}
                    </Text>
                    <View className="flex flex-row">
                        <TouchableOpacity
                            className="bg-border p-4 rounded-xl space-x-4"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="font-semibold text-black">Cancelar</Text>
                        </TouchableOpacity>
                        <View className="w-16" />
                        <TouchableOpacity
                            className="bg-black p-4 rounded-xl space-x-4"
                            onPress={handleConfirm}
                        >
                            <Text className="font-semibold text-white">Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ConfirmButton;

/* <Pressable
        onPress={handleSubmit(onSubmit)}
        className="p-4 rounded-full bg-black justify-center items-center flex flex-row space-x-1 relative"
    >
        <Text
            className={cn(
                'font-bold text-white',
                isUpdatePending && 'opacity-0',
            )}
        >
            Enviar tarea
        </Text>

        {isUpdatePending && (
            <View className="absolute inset-x-0 inset-y-0 flex items-center justify-center">
                <ActivityIndicator size="small" color="white" />
            </View>
        )}
    </Pressable> */
