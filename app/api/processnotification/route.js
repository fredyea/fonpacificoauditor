import { NextResponse } from 'next/server';
import { messaging } from '@/config/firebase-admin';

export async function POST(request) {
  try {
    const { fromToken, toToken, notification } = await request.json();
    console.log('Procesando notificación:', { fromToken, toToken, notification });

    if (!fromToken || !toToken || !notification) {
      console.error('Faltan datos requeridos:', { fromToken, toToken, notification });
      return NextResponse.json(
        { error: 'Se requieren fromToken, toToken y notification' },
        { status: 400 }
      );
    }

    if (!notification.title || !notification.body) {
      console.error('La notificación debe incluir título y cuerpo');
      return NextResponse.json(
        { error: 'La notificación debe incluir título y cuerpo' },
        { status: 400 }
      );
    }

    try {
      // Validar formato de tokens
      if (typeof toToken !== 'string' || toToken.length < 100) {
        console.error('Token de destino inválido:', toToken);
        return NextResponse.json(
          { error: 'El token de destino no tiene un formato válido' },
          { status: 400 }
        );
      }

      // Construir el mensaje con la imagen correcta
      const message = {
        token: toToken,
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl || '/avatar1.png'
        },
        webpush: {
          notification: {
            icon: notification.icon || '/avatar1.png',
            badge: '/avatar1.png',
            image: notification.imageUrl || '/avatar1.png',
            requireInteraction: true,
            vibrate: [200, 100, 200],
            sound: '/notification-sound.mp3'
          },
          fcmOptions: {
            link: '/notifications'
          }
        },
        data: {
          imageUrl: notification.imageUrl || '/avatar1.png',
          icon: notification.icon || '/avatar1.png',
          type: 'notification',
          timestamp: Date.now().toString()
        }
      };

      console.log('Notificación recibida:', notification);
      console.log('Mensaje construido:', JSON.stringify(message, null, 2));
      console.log('Enviando mensaje a Firebase...');
      
      try {
        const response = await messaging.send(message);
        console.log('Respuesta de Firebase:', response);

        return NextResponse.json({ 
          success: true,
          message: 'Notificación enviada exitosamente',
          messageId: response
        });
      } catch (firebaseError) {
        console.error('Error de Firebase al enviar notificación:', {
          code: firebaseError.code,
          message: firebaseError.message,
          errorInfo: firebaseError.errorInfo
        });

        // Manejar errores específicos de Firebase
        if (firebaseError.code === 'messaging/registration-token-not-registered') {
          return NextResponse.json(
            { 
              error: 'Token de notificación no válido o expirado',
              details: firebaseError.message,
              code: firebaseError.code
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { 
            error: 'Error al enviar la notificación a Firebase',
            details: firebaseError.message,
            code: firebaseError.code
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Error al procesar la notificación:', error);
      return NextResponse.json(
        { error: 'Error al procesar la notificación', details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error al parsear la solicitud:', error);
    return NextResponse.json(
      { error: 'Error al parsear la solicitud', details: error.message },
      { status: 400 }
    );
  }
} 