import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const avatar = formData.get('avatar');

    if (!avatar) {
      return NextResponse.json(
        { error: 'No se proporcionó ninguna imagen' },
        { status: 400 }
      );
    }

    // Aquí deberías implementar la lógica para guardar la imagen
    // Por ejemplo, subir a un servicio de almacenamiento o guardar en el servidor
    // Por ahora, simularemos una respuesta exitosa
    const avatarPath = 'ruta/simulada/avatar.jpg';

    return NextResponse.json({ avatarPath });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 