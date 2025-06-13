import { NextResponse } from 'next/server';
import admin from '@/config/firebase-admin';

export async function POST(request) {
  try {
    const { fromToken, toToken, notification } = await request.json();
    console.log('Recibida solicitud para enviar notificación:', { fromToken, toToken, notification });

    if (!fromToken || !toToken || !notification) {
      return NextResponse.json(
        { success: false, message: 'Se requieren fromToken, toToken y notification' },
        { status: 400 }
      );
    }

    // Construir el mensaje para Firebase
    console.log('UR EN IMAGEN')
    console.log(notification.imageUrl )
    const message = {
      token: toToken,
      notification: {
        title: notification.title,
        body: notification.body
      },
      webpush: {
        notification: {
          icon: notification.icon || '/avatar1.png',
          badge: '/avatar1.png',
          requireInteraction: true,
          vibrate: [200, 100, 200],
          sound: '/notification-sound.mp3'
        },
        fcmOptions: {
          link: '/notifications'
        }
      },
      data: {
        icon: notification.icon || '/avatar1.png',
        type: 'notification',
        timestamp: Date.now().toString()
      }
    };

    console.log('Notificación recibida:', JSON.stringify(notification, null, 2));
    console.log('Mensaje construido para Firebase:', JSON.stringify(message, null, 2));

    // Enviar el mensaje a Firebase
    const response = await admin.messaging().send(message);
    console.log('Notificación enviada exitosamente:', response);

    return NextResponse.json({
      success: true,
      message: 'Notificación enviada exitosamente',
      messageId: response
    });
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
    console.error('Detalles del error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        success: false,
        message: 'Error al enviar la notificación',
        error: error.message
      },
      { status: 500 }
    );
  }
} 