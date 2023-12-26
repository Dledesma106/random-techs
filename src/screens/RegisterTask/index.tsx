import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { addRegisterTaskBranchFieldScreenListener } from './RegisterTaskBranchFieldScreen';
import { FetchBranchesBranchItem } from './RegisterTaskBranchFieldScreen/queries';
import { addRRegisterTaskBusinessFieldScreenListener } from './RegisterTaskBusinessFieldScreen';
import { FetchBusinessesDataItem } from './RegisterTaskBusinessFieldScreen/queries';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputFromOuterScreen } from '@/components/ui/Input';
import { TaskType } from '@/models/types';
import { RegisterTaskScreenProp } from '@/navigation/types';

type FormValues = {
    branch?: {
        value: FetchBranchesBranchItem;
        label: string;
    };
    business?: {
        value: FetchBusinessesDataItem;
        label: string;
    } | null;
    taskType?: TaskType;
    description?: string;
    imageURI?: string;
    workOrderNumber?: number;
};

const RegisterTask = ({ navigation }: RegisterTaskScreenProp) => {
    const form = useForm<FormValues>();

    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (name === 'branch' && type === 'valueChange') {
                form.setValue('business', null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [form.watch]);

    const branch = form.watch('branch')?.value;

    return (
        <ScrollView className="bg-background h-screen">
            <View className="px-4 space-y-4 py-4">
                <Form {...form}>
                    <View className="space-y-4">
                        <FormField
                            control={form.control}
                            name="branch"
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sucursal</FormLabel>
                                    <InputFromOuterScreen
                                        {...field}
                                        placeholder="Selecciona una sucursal"
                                        onNavigate={() => {
                                            navigation.navigate(
                                                'RegisterTaskBranchFieldScreen',
                                                {
                                                    value: field.value?.value._id ?? null,
                                                },
                                            );
                                        }}
                                        addScreenListener={(setValue) => {
                                            addRegisterTaskBranchFieldScreenListener(
                                                (branch) => {
                                                    setValue(branch, branch.city.name);
                                                },
                                            );
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="business"
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            disabled={!branch}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Empresa</FormLabel>
                                    <InputFromOuterScreen
                                        {...field}
                                        placeholder="Selecciona una empresa"
                                        onNavigate={() => {
                                            if (!branch) return;

                                            navigation.navigate(
                                                'RegisterTaskBusinessFieldScreen',
                                                {
                                                    value: field.value?.value._id ?? null,
                                                    branchId: branch._id,
                                                },
                                            );
                                        }}
                                        addScreenListener={(setValue) => {
                                            addRRegisterTaskBusinessFieldScreenListener(
                                                (business) => {
                                                    setValue(business, business.name);
                                                },
                                            );
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </View>
                </Form>
            </View>
        </ScrollView>
    );
};

export default RegisterTask;
