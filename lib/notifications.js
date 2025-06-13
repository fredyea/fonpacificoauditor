import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

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

// Inicializar Firebase solo cuando sea necesario
const initializeFirebase = () => {
  if (!app) {
    console.log('Inicializando Firebase con config:', {
      projectId: firebaseConfig.projectId,
      messagingSenderId: firebaseConfig.messagingSenderId
    });

    try {
      app = initializeApp(firebaseConfig);
      messaging = getMessaging(app);

      // Configurar el manejo de mensajes en primer plano
      onMessage(messaging, (payload) => {
        console.log('Mensaje recibido en primer plano:', payload);
        
        // Mostrar notificación usando la API de Notificaciones del navegador
        if (Notification.permission === 'granted') {
          const notification = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.imageUrl || payload.notification.icon || '/avatar1.png',
            image: payload.notification.imageUrl || payload.notification.icon || '/avatar1.png',
            badge: payload.notification.imageUrl || payload.notification.icon || '/avatar1.png',
            vibrate: [200, 100, 200],
            requireInteraction: true
          });

          // Reproducir sonido de notificación
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(error => {
            console.error('Error al reproducir el sonido:', error);
          });

          // Opcional: Manejar el clic en la notificación
          notification.onclick = function(event) {
            event.preventDefault();
            window.focus();
            notification.close();
          };
        }
      });
    } catch (error) {
      console.error('Error al inicializar Firebase:', error);
      throw new Error('Error al inicializar Firebase: ' + error.message);
    }
  }
  return messaging;
};

const _servidorapi = process.env.NEXT_PUBLIC_API_URL ? 
  `${process.env.NEXT_PUBLIC_API_URL}/` : 
  '/api/';

// Función para actualizar el token en el servidor
const updateTokenInServer = async (userId, newToken) => {
  try {
    const response = await fetch(`${_servidorapi}savenotificationtoken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        token: newToken
      })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el token');
    }

    return true;
  } catch (error) {
    console.error('Error al actualizar el token:', error);
    return false;
  }
};

export const sendNotification = async (userId, title, body, avatar = '/avatar-default.png') => {
  try {
    console.log('Iniciando proceso de envío de notificación:', {
      userId,
      title,
      body,
      avatar
    });

    // Verificar que el avatar sea una URL válida
    if (!avatar.startsWith('http') && !avatar.startsWith('/')) {
      avatar = `${process.env.NEXT_PUBLIC_API_URLPDF}/${avatar}`;
    }
    
    console.log('Avatar procesado:', avatar);
    
    // Asegurarse de que Firebase está inicializado
    const messagingInstance = initializeFirebase();
    
    // Obtener el token actual del dispositivo primero
    let currentToken;
    try {
      currentToken = await getToken(messagingInstance, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });

      if (!currentToken) {
        throw new Error('No se pudo obtener el token actual del dispositivo');
      }

      // Actualizar el token en el servidor para el usuario actual
      await updateTokenInServer(userId, currentToken);

      console.log('Token del dispositivo actual obtenido:', {
        tokenLength: currentToken.length,
        tokenStart: currentToken.substring(0, 10) + '...'
      });
    } catch (tokenError) {
      console.error('Error al obtener el token del dispositivo:', tokenError);
      throw new Error('Error al obtener el token del dispositivo: ' + tokenError.message);
    }

    // Obtener el token del usuario destinatario
    const tokenResponse = await fetch(`${_servidorapi}getnotificationtoken/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Error al obtener el token:', {
        estado: tokenResponse.status,
        mensaje: tokenResponse.statusText,
        error: errorData,
        url: tokenResponse.url
      });
      throw new Error(`Error al obtener el token: ${errorData}`);
    }

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.token) {
      throw new Error('No se encontró token para el usuario');
    }

    // Validar formato del token
    if (typeof tokenData.token !== 'string' || tokenData.token.length < 100) {
      console.error('Token inválido:', tokenData.token);
      throw new Error('El formato del token de notificación no es válido');
    }

    console.log('Token obtenido correctamente:', {
      tokenLength: tokenData.token.length,
      tokenStart: tokenData.token.substring(0, 10) + '...'
    });

    // Enviar la notificación usando la ruta local de Next.js
    const notificationPayload = {
      fromToken: currentToken,
      toToken: tokenData.token,
      notification: {
        title,
        body,
        imageUrl: avatar,
        icon: avatar,
        badge: avatar,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        sound: '/notification-sound.mp3'
      },
      data: {
        imageUrl: avatar,
        icon: avatar,
        type: 'notification',
        timestamp: Date.now().toString()
      }
    };

    console.log('Avatar recibido:', avatar);
    console.log('Payload de notificación:', JSON.stringify(notificationPayload, null, 2));

    const response = await fetch('/api/sendnotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationPayload)
    });

    let responseData;
    const responseText = await response.text();
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Error al parsear la respuesta:', responseText);
      throw new Error('La respuesta del servidor no es un JSON válido: ' + responseText);
    }

    if (!response.ok) {
      console.error('Error en la respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        text: responseText
      });

      // Si el token no está registrado, intentamos actualizar el token y reenviar
      if (responseData.code === 'messaging/registration-token-not-registered') {
        console.log('Token no registrado, intentando actualizar...');
        
        // Obtener un nuevo token
        const newToken = await getToken(messagingInstance, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        });

        if (newToken) {
          // Actualizar el token en el servidor
          await updateTokenInServer(userId, newToken);
          
          // Reintentar el envío con el nuevo token
          return sendNotification(userId, title, body, avatar);
        }
      }

      throw new Error(responseData.error || 'Error en el servidor al procesar la notificación');
    }

    console.log('Notificación enviada exitosamente:', responseData);
    return true;
  } catch (error) {
    console.error('Error en el proceso de notificación:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}; 