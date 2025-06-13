import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, deleteToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let messaging;
let serviceWorkerRegistration;

const waitForServiceWorkerActive = async (registration) => {
  if (registration.active) {
    return registration;
  }

  return new Promise((resolve) => {
    if (registration.installing || registration.waiting) {
      // Service worker está instalando o esperando
      const serviceWorker = registration.installing || registration.waiting;

      serviceWorker.addEventListener('statechange', function(e) {
        if (e.target.state === 'activated') {
          resolve(registration);
        }
      });
    } else {
      resolve(registration);
    }
  });
};

// Initialize Firebase if it hasn't been initialized yet
export const initializeFirebase = async () => {
  try {
    if (!app) {
      app = initializeApp(firebaseConfig);
      console.log('Firebase App inicializado');
    }

    if ('serviceWorker' in navigator) {
      try {
        // Registrar el service worker
        serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        
        console.log('Service Worker registrado, esperando activación...');
        
        // Esperar a que el service worker esté activo
        await waitForServiceWorkerActive(serviceWorkerRegistration);
        console.log('Service Worker está activo');

        // Initialize messaging
        if (!messaging) {
          messaging = getMessaging(app);
          console.log('Firebase Messaging inicializado');

          // Set up foreground notification handler
          onMessage(messaging, (payload) => {
            console.log('Mensaje recibido en primer plano:', payload);
            
            if (Notification.permission === 'granted') {
              const notification = new Notification(payload.notification.title, {
                body: payload.notification.body,
                icon: '/logo.png'
              });
              
              notification.onclick = function(event) {
                event.preventDefault();
                window.focus();
                notification.close();
              };
            }
          });
        }

        // Enviar configuración al service worker
        if (serviceWorkerRegistration.active) {
          serviceWorkerRegistration.active.postMessage({
            type: 'FIREBASE_CONFIG',
            config: firebaseConfig
          });
          console.log('Configuración enviada al Service Worker');
        }

        return serviceWorkerRegistration;
      } catch (error) {
        console.error('Error al registrar Service Worker:', error);
        // No lanzamos el error para permitir que la app continúe funcionando
      }
    } else {
      console.warn('Este navegador no soporta Service Workers');
    }
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
    // No lanzamos el error para permitir que la app continúe funcionando
  }
};

export const resetNotificationPermission = async () => {
  try {
    if (!messaging) {
      await initializeFirebase();
    }
    
    if (messaging) {
      try {
        await deleteToken(messaging);
        console.log('Token eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar token:', error);
      }
    }
    
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      console.log('Service Workers desregistrados');
    }
    
    return true;
  } catch (error) {
    console.error('Error al resetear permisos:', error);
    return false;
  }
};

export const requestNotificationPermission = async (forceNew = false) => {
  try {
    // Reset if forcing new token
    if (forceNew) {
      await resetNotificationPermission();
    }

    // Initialize Firebase if not already initialized
    await initializeFirebase();

    // Esperar a que el service worker esté activo
    if (!serviceWorkerRegistration?.active) {
      console.warn('Service Worker no está activo, esperando...');
      return null;
    }

    // Si no tenemos messaging, no podemos continuar
    if (!messaging) {
      console.warn('Firebase Messaging no está disponible');
      return null;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permiso de notificación denegado');
      return null;
    }

    // Get FCM token
    try {
      console.log('Solicitando token FCM...');
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: serviceWorkerRegistration
      });

      if (currentToken) {
        console.log('Token obtenido correctamente');
        return currentToken;
      } else {
        console.log('No se pudo obtener el token');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  } catch (error) {
    console.error('Error al solicitar permiso de notificación:', error);
    return null;
  }
}; 