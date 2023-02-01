import React from 'react';
import { TextInput, Text, TextInputProps } from 'react-native';


interface Props {
    title:string,
    value:string,
    custom:TextInputProps
}

function Input({ title, custom, value }:Props) {
    return (
        <>
            <Text className='text-lg m-4'>{title}</Text>
            <TextInput
                className='text-lg border-2 px-4 mx-4'
                value={value}
                {...custom}
            />
        </>
    );
}

export default Input;