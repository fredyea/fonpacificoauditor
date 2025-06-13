// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

let messaging;

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker...', event);
  self.skipWaiting(); // Fuerza la activación inmediata
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker...', event);
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Toma el control inmediatamente
      // Notifica a todos los clientes que el service worker está activo
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SERVICE_WORKER_ACTIVATED'
          });
        });
      })
    ])
  );
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received:', event);

  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[Service Worker] Push data:', payload);

      const notificationTitle = payload.notification?.title || 'Nueva Notificación';
      const notificationOptions = {
        body: payload.notification?.body || 'Hay una nueva actualización',
        icon: payload.notification?.imageUrl || payload.notification?.icon || '/avatar1.png',
        badge: '/avatar1.png',
        tag: 'notification-' + Date.now(),
        data: payload.data || {},
        requireInteraction: true,
        vibrate: [200, 100, 200]
      };

      console.log('Opciones de notificación:', notificationOptions);

      event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
      );
    } catch (error) {
      console.error('[Service Worker] Error processing push event:', error);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click:', event);

  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(function(clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});

// Get the Firebase config from the window object
self.addEventListener('message', function(event) {
  console.log('[Service Worker] Message Received:', event.data?.type);
  
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    console.log('[Service Worker] Received Firebase config, initializing...');
    const firebaseConfig = event.data.config;
    
    try {
      if (!self.firebase) {
        firebase.initializeApp(firebaseConfig);
        console.log('[Service Worker] Firebase initialized');
        
        // Retrieve an instance of Firebase Messaging so that it can handle background messages.
        messaging = firebase.messaging();
        console.log('[Service Worker] Firebase Messaging initialized');

        // Handle background messages
        messaging.onBackgroundMessage((payload) => {
          console.log('Received background message:', payload);

          const notificationTitle = payload.notification.title;
          const imageUrl = payload.notification.imageUrl || payload.notification.icon || payload.data?.imageUrl || '/avatar-default.png';
          
          console.log('URL de la imagen para la notificación:', imageUrl);

          const notificationOptions = {
            body: payload.notification.body,
            icon: payload.notification.imageUrl || payload.notification.icon || '/avatar1.png',
            badge: '/avatar1.png',
            vibrate: [200, 100, 200],
            requireInteraction: true,
            data: payload.data || {}
          };

          console.log('Opciones de notificación:', notificationOptions);

          // Reproducir sonido de notificación
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(error => {
            console.error('Error al reproducir el sonido:', error);
          });

          return self.registration.showNotification(notificationTitle, notificationOptions);
        });

        // Notificar que Firebase está listo
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'FIREBASE_INITIALIZED'
            });
          });
        });
      } else {
        console.log('[Service Worker] Firebase already initialized');
      }
    } catch (error) {
      console.error('[Service Worker] Error initializing Firebase:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  }
}); 