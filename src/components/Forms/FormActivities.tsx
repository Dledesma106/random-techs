// eslint-disable-next-line @typescript-eslint/quotes
import moment from 'moment';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

import { IActivity } from '../../models/interfaces';

function validate(input: IActivity): { [key: string]: string } {
    const error: { [key: string]: string } = {};
    if (!input.name) {
        error.name = 'Se requiere nombre de Actividad';
    }
    if (!input.description) {
        error.description = 'Se requiere descripción';
    }
    return error;
}

export default function FormActivities() {
    const [error, setError] = useState<{ [key: string]: string }>({
        name: 'Se requiere nombre de Actividad',
        description: 'Se requiere una descripción',
    });

    const [input, setInput] = useState<IActivity>({
        name: '',
        description: '',
        startDate: moment().toDate(),
        finishDate: moment().toDate(),
        openedBy: '',
        deleted: false,
    });
    const [isCreating, setIsCreating] = useState(true);

    useEffect(() => {
        if (isCreating) {
            setInput({
                ...input,
                startDate: moment().toDate(),
            });
        }
    }, [isCreating]);

    function handleChange(name: keyof IActivity, value: string) {
        setInput({
            ...input,
            [name]: value,
        });
        setError(
            validate({
                ...input,
                [name]: value,
            }),
        );
    }

    async function handleSubmit() {
        try {
            setInput({
                name: '',
                description: '',
                startDate: moment().toDate(),
                finishDate: moment().toDate(),
                openedBy: '',
                deleted: false,
            });
            setIsCreating(false);

            throw new Error('No implementado');
        } catch (error) {
            console.error('Error al guardar la actividad:', error);
        }
    }

    return (
        <View>
            <TextInput
                value={input.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Nombre de la Actividad"
            />
            {error.name && <Text style={{ color: 'red' }}>{error.name}</Text>}
            <TextInput
                value={input.description}
                onChangeText={(text) => handleChange('description', text)}
                placeholder="Description"
            />
            {error.description && (
                <Text style={{ color: 'red' }}>{error.description}</Text>
            )}
            <Button title="Guardar" onPress={handleSubmit} />
        </View>
    );
}
