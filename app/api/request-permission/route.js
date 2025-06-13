import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { type, description, startDateTime, endDateTime } = await request.json();

    if (!type || !description || !startDateTime || !endDateTime) {
      return NextResponse.json(
        { error: 'Se requieren todos los campos' },
        { status: 400 }
      );
    }

    // Aquí deberías implementar la lógica para:
    // 1. Validar que el usuario tenga permisos para solicitar
    // 2. Guardar la solicitud en la base de datos
    // 3. Notificar a los aprobadores
    // Por ahora, simularemos una respuesta exitosa

    return NextResponse.json({ 
      message: 'Solicitud de permiso registrada exitosamente',
      permissionId: 'PERM-' + Date.now() // Simulamos un ID de permiso
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 