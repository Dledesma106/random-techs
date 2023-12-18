import clsx from 'clsx';
import { useState } from 'react';
import { Controller, FieldValues, Path, RegisterOptions, Control } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

export type DropdownItem = {
    label: string;
    value: string;
};

type DropdownProps = {
    items: DropdownItem[];
    label: string;
    value: DropdownItem['value'];
    onChange: (value: string) => void;
};

const Dropdown: React.FC<DropdownProps> = (props) => {
    const { items, label, value, onChange } = props;

    const [selectedItem, setSelectedItem] = useState<DropdownItem['value'] | null>(value);

    const selectItem = (item: DropdownItem) => {
        setSelectedItem(item.value);
        onChange(item.value);
    };

    return (
        <View>
            <View className="flex flex-row justify-between items-center py-4 border-y border-gray-200 bg-gray-100 px-4">
                <Text className="font-bold">{label}</Text>
            </View>

            {items.map((item, index) => {
                return (
                    <View
                        className={clsx(
                            index !== items.length - 1 && 'border-b border-gray-300',
                        )}
                        key={index}
                    >
                        <TouchableOpacity
                            className="py-4 px-4 flex justify-between flex-row items-center"
                            onPress={() => selectItem(item)}
                        >
                            <Text>{item.label}</Text>

                            <View className="rounded-full border w-4 h-4 flex items-center justify-center">
                                {selectedItem === item.value && (
                                    <View className="bg-black rounded-full w-2.5 h-2.5"></View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );
};

type Props<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
    name: TName;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues, TName>;
    items: DropdownItem[];
    label: string;
} & (TFieldValues[Extract<keyof TFieldValues, TName>] extends DropdownItem['value']
    ? object
    : never);

const RHFDropdown = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>(
    props: Props<TFieldValues, TName>,
) => {
    const { control, name, rules, ...rest } = props;

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value } }) => (
                <Dropdown {...rest} onChange={onChange} value={value} />
            )}
        />
    );
};

export default RHFDropdown;
