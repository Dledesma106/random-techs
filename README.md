# Random Techs

Una aplicación móvil desarrollada con React Native y Expo.

## Scripts disponibles

### Desarrollo

- `yarn dev` - Inicia el servidor de desarrollo con Expo Go
- `yarn android` - Ejecuta la aplicación en un dispositivo/emulador Android
- `yarn ios` - Ejecuta la aplicación en un dispositivo/emulador iOS
- `yarn web` - Inicia el servidor web de desarrollo

### Construcción de APK

Para construir la aplicación Android, se han incluido los siguientes scripts:

- `yarn clean:android` - Limpia la carpeta de construcción de Android
- `yarn bundle:android` - Genera el bundle de JavaScript para Android
- `yarn build:android:dev` - Genera una APK de desarrollo (debug)
- `yarn build:android:prod` - Genera una APK de producción (release)

**Scripts combinados:**
- `yarn build:android:dev:full` - Ejecuta todos los pasos para generar una APK de desarrollo
- `yarn build:android:prod:full` - Ejecuta todos los pasos para generar una APK de producción

### Proceso de construcción de APK

Puedes construir la APK manualmente siguiendo estos pasos:

1. Limpia la carpeta de construcción de Android:
   ```
   yarn clean:android
   ```

2. Genera el bundle de JavaScript para Android:
   ```
   yarn bundle:android
   ```

3. Construye la APK de desarrollo o producción:
   ```
   yarn build:android:dev
   ```
   o
   ```
   yarn build:android:prod
   ```

O puedes usar los scripts combinados:
```
yarn build:android:dev:full
```
o
```
yarn build:android:prod:full
```

4. Las APKs generadas se encuentran en las siguientes ubicaciones:
   - Desarrollo: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Producción: `android/app/build/outputs/apk/release/app-release.apk`

### Otras utilidades

- `yarn lint` - Ejecuta el linter
- `yarn lint:fix` - Corrige errores de linting
- `yarn format` - Verifica el formato del código
- `yarn format:fix` - Corrige el formato del código
- `yarn lint-format:fix` - Corrige errores de linting y formato

## Gestión de temas

La aplicación utiliza un sistema de gestión de temas con las siguientes características:

1. **Themes**: Soporta temas `light`, `dark` y `system`
2. **Colores**: Usa NativeWind y Tailwind CSS para aplicar estilos según el tema

### Uso de temas en componentes

```jsx
import useThemeColors from '../hooks/useThemeColors';

const MyComponent = () => {
    const { 
        bgBackground, 
        textForeground, 
        colorScheme 
    } = useThemeColors();

    return (
        <View className={`p-4 ${bgBackground}`}>
            <Text className={`text-lg ${textForeground}`}>
                Tema actual: {colorScheme}
            </Text>
        </View>
    );
};
```

## Requisitos

- Node.js (>=14.0.0)
- Yarn
- JDK 11
- Android SDK (para Android)
- Xcode (para iOS)
