import React from 'react';
import RNPickerSelect, { Item } from 'react-native-picker-select';
type Props = {
    items: Item[];
    placeholder: string;
    onValueChange: (value: string | null) => void;
};
const Dropdown: React.FC<Props> = ({ items, placeholder, onValueChange }) => {
    return (
        <RNPickerSelect
            onValueChange={onValueChange}
            items={items}
            style={pickerSelectStyles}
            placeholder={{ label: placeholder, value: null }}
        />
    );
};

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: 'white',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        backgroundColor: 'white',
    },
};
export default Dropdown;
