import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
const TextArea: React.FC = () => {
    const [text, setText] = useState('');
    const [height, setHeight] = useState(0);
    return (
        <View style={styles.container}>
            {' '}
            <TextInput
                style={[styles.textInput, { height: Math.max(40, height) }]}
                multiline
                onChangeText={setText}
                onContentSizeChange={(event) =>
                    setHeight(event.nativeEvent.contentSize.height)
                }
                value={text}
                placeholder="Escribe aquí..."
            />{' '}
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    textInput: { borderColor: 'gray', borderWidth: 1, padding: 10, fontSize: 16 },
});
export default TextArea;
