import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { description, userId } = await request.json();

    if (!description || !userId) {
      return NextResponse.json(
        { error: 'Se requieren todos los campos' },
        { status: 400 }
      );
    }

    // Aquí deberías implementar la lógica para:
    // 1. Validar que el usuario existe y tiene permisos
    // 2. Crear el ticket en la base de datos
    // 3. Notificar a los responsables
    // Por ahora, simularemos una respuesta exitosa

    return NextResponse.json({ 
      message: 'Ticket creado exitosamente',
      ticketId: 'TK-' + Date.now() // Simulamos un ID de ticket
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 