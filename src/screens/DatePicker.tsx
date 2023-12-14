import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { View, Button, Platform, StyleSheet } from 'react-native';

const DatePicker = () => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate ?? date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShowPicker(true);
    };

    return (
        <View style={styles.container}>
            <Button onPress={showDatepicker} title="Seleccionar fecha" color="#888888" />
            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="datetime"
                    display="default"
                    onChange={onDateChange}
                    textColor="#666666"
                    style={styles.datePicker}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f7f7f7',
        borderRadius: 50,
    },
    datePicker: {
        backgroundColor: '#f2f2f2',
        marginTop: 8,
    },
});

export default DatePicker;
