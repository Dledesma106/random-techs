import React from 'react';
import { TextInput, Text, TextInputProps } from 'react-native';

interface Props {
    title: string;
    value: string;
    titleStyle?: string;
    inputStyle?: string;
    custom: TextInputProps;
}

function Input({
    title,
    custom,
    value,
    titleStyle = 'text-lg m-4',
    inputStyle = 'text-lg border-b-2 rounded-md border-gray-600 px-4 mx-4',
}: Props) {
    return (
        <>
            <Text className={titleStyle}>{title}</Text>
            <TextInput className={inputStyle} value={value} {...custom} />
        </>
    );
}

export default Input;
