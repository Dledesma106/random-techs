import { NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';

// Reemplaza
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: object) {
    navigationRef.current?.navigate(name, params);
}

// Puedes agregar más funciones de ayuda de navegación aquí si es necesario
// export function goBack() {
//   navigationRef.current?.goBack();
// }
