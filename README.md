# random-techs

Aplicacion movil que acompaña a sistema-administrativo-random, que permite a los técnicos ver tareas que les fueron asignadas, y registrar gastos realizados para completar dichas tareas.

Utiliza React Native para que pueda ser compilado tanto para android como ios

## Sobre las tecnologías utilizadas

-   React Native: Framework para desarrollar aplicaciones móviles multiplataforma
-   Expo: Plataforma para desarrollar aplicaciones móviles con React Native
-   TypeScript: Lenguaje de programación
-   EAS: Herramienta para hacer build de aplicaciones móviles
-   Nativewind: Librería de estilos para React Native basada en Tailwind CSS
-   React Query: Librería para manejar el estado de la aplicación y hacer peticiones a la API
-   @tanstack/query-async-storage-persister: Plugin para React Query que permite guardar el estado de la aplicación en el AsyncStorage

## Requisitos previos

### 1. Instala Node.js

Descarga e instala Node.js desde https://nodejs.org/

### 2. Instala Expo CLI

Ejecuta el comando:

```sh
npm install -g expo-cli
```

### 3. Instala el cliente de EAS

Ejecuta el comando:

```sh
npm install -g eas-cli
```

## ¿Como correr el proyecto?

### 1. Instala las dependencias

Ejecuta el comando:

```sh
yarn install
```

### 2. Configura el archivo .env

Copia el archivo .env.example y renombralo a .env, luego configura las variables de entorno.
Las variables de entorno necesarias son:

-   EXPO_PUBLIC_API_HOST: La url del servidor de sistema-administrativo-random. Ej: http://localhost:3000

### 3. Corre el proyecto

Ejecuta el comando:

```sh
yarn start
```

o si no tienes yarn instalado:

```sh
npm start
```

## ¿Como hacer el build de un APK?

Recuerda que para seguir los pasos necesitas tener el cliente de EAS instalado y una cuenta en expo.dev.

### 1. Configura un proyecto en https://expo.dev

Primero necesitas tener un proyecto en https://expo.dev, si no tienes uno, crea uno y anota el id del proyecto.

### 2. Configura el archivo app.config.ts

Revisa el archivo app.config.ts y busca la sección "extras" -> "eas" -> "projectId" y cambia el valor por el id de tu proyecto en expo.dev

Entonces el archivo app.config.ts debería verse algo así:

```ts
import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

const config = ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    extra: {
        eas: {
            projectId: 'El id de tu proyecto en expo.dev',
        },
    },
    // Add custom config here
});

export default config;
```

### 3. Configura el archivo .env

Ejecuta el comando:

```sh
eas build -p android --profile preview
```

Esto empezará el proceso de build en expo.dev.
Las variables de entorno ya se encuentran configuradas en el archivo eas.json.

### 4. Descarga el APK

Una vez que el build haya terminado, descarga el APK desde la página de expo.dev.

### 5. Instala el APK

Instala el APK en tu dispositivo android y listo.
