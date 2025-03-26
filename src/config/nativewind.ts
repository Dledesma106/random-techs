import { NativeWindStyleSheet } from 'nativewind';

// Configurar NativeWind para que funcione correctamente
NativeWindStyleSheet.setOutput({
    default: 'native',
});

// Asegurarnos de que el modo oscuro funcione correctamente
try {
    // Intentar configurar el modo oscuro
    console.log('Configurando modo oscuro en NativeWind...');

    // Configurar para que use variables CSS en lugar de clases dark:
    NativeWindStyleSheet.setColorScheme('light');
} catch (error) {
    console.error('Error al configurar el modo oscuro en NativeWind:', error);
}

// Exportar la configuración para que pueda ser importada en otros archivos
export default NativeWindStyleSheet;
