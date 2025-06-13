import { NextResponse } from 'next/server';
import pool from '@/config/db';

export async function POST(request) {
  try {
    const { userId, token } = await request.json();
    console.log('Recibida solicitud para guardar token:', { userId, tokenLength: token?.length });

    if (!userId || !token) {
      return NextResponse.json(
        { success: false, message: 'Se requieren userId y token' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Primero eliminamos cualquier token existente para este usuario
      await connection.query(
        'DELETE FROM notification_tokens WHERE user_id = ?',
        [userId]
      );
      console.log('Token anterior eliminado para usuario:', userId);

      // Luego insertamos el nuevo token
      await connection.query(
        'INSERT INTO notification_tokens (user_id, token) VALUES (?, ?)',
        [userId, token]
      );
      console.log('Nuevo token guardado para usuario:', userId);

      return NextResponse.json({
        success: true,
        message: 'Token guardado exitosamente'
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al guardar el token:', error);
    return NextResponse.json(
      { success: false, message: 'Error al guardar el token' },
      { status: 500 }
    );
  }
} 