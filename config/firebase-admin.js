import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

let messagingInstance;

// Función para obtener la instancia de messaging
const getMessagingInstance = () => {
  if (!messagingInstance) {
    // Verifica si ya está inicializado para evitar múltiples inicializaciones
    const apps = getApps();
    if (!apps.length) {
      // Asegúrate de que las variables de entorno estén configuradas
      if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.error('Firebase Admin SDK requiere FIREBASE_PRIVATE_KEY y FIREBASE_CLIENT_EMAIL');
        throw new Error('Configuración de Firebase Admin incompleta');
      }

      try {
        initializeApp({
          credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // El private key viene con caracteres de nueva línea escapados, necesitamos reemplazarlos
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
          databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
        });
      } catch (error) {
        console.error('Error al inicializar Firebase Admin:', error);
        throw error;
      }
    }

    try {
      messagingInstance = getMessaging();
    } catch (error) {
      console.error('Error al obtener la instancia de messaging:', error);
      throw error;
    }
  }
  return messagingInstance;
};

// Exporta la función para obtener messaging
export const messaging = getMessagingInstance();

// Para mantener compatibilidad con el código existente
export default { messaging: () => getMessagingInstance() }; 