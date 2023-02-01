import React from 'react';
import { TouchableOpacity, Text } from 'react-native';


interface Props{
    title:string,
    action:()=>void
}

function Button({ title, action }:Props) {
    return (
        <TouchableOpacity
            onPress={action}
            className=' border-2 w-1/2 self-center m-4 p-2 rounded-lg'
        >
            <Text className='self-center text-lg'>{title}</Text>
        </TouchableOpacity>
    );
}

export default Button;