import { EvilIcons, AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';

import { useUploadImageToExpenseMutation } from './mutations';

import { RegisterExpenseOnTaskScreenRouteProp } from '@/navigation/types';
import { addFullScreenCameraListener } from '@/screens/FullScreenCamera';

import { card, cardItem, cardTitle } from '../../../styles';
import { dmyDateString } from '../../lib/utils';
import { ExpenseType, expenseTypes, PaySource, paySources } from '../../models/types';

const RegisterExpenseOnTask = ({
    route,
    navigation,
}: RegisterExpenseOnTaskScreenRouteProp) => {
    const { task, expense } = route.params;
    const [showTypes, setShowTypes] = useState<boolean>(false);
    const [expenseType, setExpenseType] = useState<ExpenseType>(expenseTypes[0]);
    const [showSources, setShowSources] = useState<boolean>(false);
    const [paySource, setPaySource] = useState<PaySource>(paySources[0]);
    const uploadImageToExpense = useUploadImageToExpenseMutation();
    function selectType(type: ExpenseType) {
        setExpenseType(type);
        setShowTypes(false);
    }

    function selectSource(source: PaySource) {
        setPaySource(source);
        setShowSources(false);
    }

    const addPictureToTask = (uri: string) => {
        uploadImageToExpense.mutate({
            expenseId: expense._id,
            localURI: uri,
        });
    };

    const goToCameraScreen = () => {
        addFullScreenCameraListener(addPictureToTask);
        navigation.navigate('FullScreenCamera');
    };

    return (
        <ScrollView className="bg-gray-300 h-screen py-4">
            <Pressable
                className="rounded-full bg-gray-50 p-4 ml-4 mb-4 w-14"
                onPress={navigation.goBack}
            >
                <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>

            <View className={card}>
                <Text className={cardTitle}>Fecha de gasto</Text>
                <Text className={cardItem}>{`${
                    task.closedAt
                        ? dmyDateString(task.closedAt)
                        : 'Aun no hay fecha de cierre seleccionada'
                }`}</Text>
            </View>

            <View className={`${card} `}>
                <Pressable
                    className="flex flex-row justify-between items-center"
                    onPress={() => setShowTypes(true)}
                >
                    <Text className={cardTitle}>Tipo de gasto</Text>
                    <View className="pr-4">
                        <AntDesign name="down" size={24} color="black" />
                    </View>
                </Pressable>
                {!showTypes && <Text className={cardItem}>{expenseType}</Text>}
                {showTypes &&
                    expenseTypes.map((type, index) => {
                        return (
                            <Pressable key={index} onPress={() => selectType(type)}>
                                <Text className={cardItem}>{type}</Text>
                            </Pressable>
                        );
                    })}
            </View>

            <View className={`${card} `}>
                <Pressable
                    className="flex flex-row justify-between items-center"
                    onPress={() => setShowSources(true)}
                >
                    <Text className={cardTitle}>Fuente de pago</Text>
                    <View className="pr-4">
                        <AntDesign name="down" size={24} color="black" />
                    </View>
                </Pressable>
                {!showSources && <Text className={cardItem}>{paySource}</Text>}
                {showSources &&
                    paySources.map((source, index) => {
                        return (
                            <Pressable key={index} onPress={() => selectSource(source)}>
                                <Text className={cardItem}>{source}</Text>
                            </Pressable>
                        );
                    })}
            </View>

            <Pressable className={`${card} w-3/4`} onPress={goToCameraScreen}>
                <View className="flex flex-row justify-between items-center">
                    <Text className={cardTitle}>Foto Ticket / Factura</Text>
                    <View className="mr-4">
                        <EvilIcons name="camera" size={32} color="black" />
                    </View>
                </View>
            </Pressable>
        </ScrollView>
    );
};

/* function TypeItem({
	expenseType,
	setExpenseType
}: {
	expenseType: ExpenseType
	setExpenseType: (expenseType: ExpenseType) => void
}) {
	function navigate() {
		setExpenseType(expenseType)
	}

	return (
		<>
			<Pressable onPress={navigate}>
				<Text className={cardItem}>{expenseType}</Text>
			</Pressable>
		</>
	)
}*/

export default RegisterExpenseOnTask;
