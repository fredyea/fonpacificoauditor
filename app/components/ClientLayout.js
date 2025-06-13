'use client';

import { useEffect } from 'react';
import { UserProvider } from '../context/UserContext';
import { initializeFirebase } from '@/lib/firebase';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Inicializar Firebase de manera no bloqueante
    const setupFirebase = () => {
      // Limpiar cualquier service worker existente primero
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }

      // Iniciar Firebase después de limpiar
      setTimeout(() => {
        initializeFirebase().catch(error => {
          console.error('Error al configurar Firebase:', error);
          // No bloqueamos la app si hay error en Firebase
        });
      }, 2000); // Dar tiempo suficiente para que se limpien los service workers
    };

    setupFirebase();

    // Cleanup al desmontar
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }
    };
  }, []);

  return (
    <UserProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {children}
    </UserProvider>
  );
} 