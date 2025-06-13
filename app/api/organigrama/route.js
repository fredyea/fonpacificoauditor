import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Obtener todo el organigrama
export async function GET(req) {
  try {
    const empresa_id = req.headers.get('x-empresa-id') || 1; // Ajusta según tu lógica de autenticación

    // Obtener todos los nodos activos de la empresa
    const nodos = await query({
      query: `
        SELECT id, titulo, nombre, padre_id, es_raiz, orden
        FROM organigrama_nodos
        WHERE empresa_id = ? AND activo = TRUE
        ORDER BY es_raiz DESC, orden ASC
      `,
      values: [empresa_id],
    });

    // Función para construir el árbol
    const construirArbol = (nodos, padre_id = null) => {
      return nodos
        .filter(nodo => nodo.padre_id === padre_id)
        .map(nodo => ({
          id: nodo.id.toString(),
          title: nodo.titulo,
          name: nodo.nombre,
          isRoot: nodo.es_raiz === 1,
          children: construirArbol(nodos, nodo.id)
        }));
    };

    const arbol = construirArbol(nodos);
    return NextResponse.json(arbol[0] || null);
  } catch (error) {
    console.error('Error al obtener el organigrama:', error);
    return NextResponse.json(
      { error: 'Error al obtener el organigrama' },
      { status: 500 }
    );
  }
}

// Crear o actualizar un nodo
export async function POST(req) {
  try {
    const { id, title, name, parentId, empresa_id = 1 } = await req.json();
    const usuario_id = 1; // Ajusta según tu lógica de autenticación

    if (id) {
      // Actualizar nodo existente
      const [nodoActual] = await query({
        query: 'SELECT titulo, nombre, padre_id FROM organigrama_nodos WHERE id = ?',
        values: [id],
      });

      await query({
        query: `
          UPDATE organigrama_nodos 
          SET titulo = ?, nombre = ?
          WHERE id = ?
        `,
        values: [title, name, id],
      });

      // Registrar en historial
      await query({
        query: `
          INSERT INTO organigrama_historial 
          (nodo_id, tipo_cambio, titulo_anterior, nombre_anterior, titulo_nuevo, nombre_nuevo, usuario_id)
          VALUES (?, 'EDICION', ?, ?, ?, ?, ?)
        `,
        values: [id, nodoActual.titulo, nodoActual.nombre, title, name, usuario_id],
      });

      return NextResponse.json({ id, message: 'Nodo actualizado exitosamente' });
    } else {
      // Crear nuevo nodo
      const [result] = await query({
        query: `
          INSERT INTO organigrama_nodos (titulo, nombre, padre_id, es_raiz, empresa_id)
          VALUES (?, ?, ?, ?, ?)
        `,
        values: [title, name, parentId, !parentId, empresa_id],
      });

      const newId = result.insertId;

      // Registrar en historial
      await query({
        query: `
          INSERT INTO organigrama_historial 
          (nodo_id, tipo_cambio, titulo_nuevo, nombre_nuevo, padre_id_nuevo, usuario_id)
          VALUES (?, 'CREACION', ?, ?, ?, ?)
        `,
        values: [newId, title, name, parentId, usuario_id],
      });

      return NextResponse.json({ 
        id: newId.toString(),
        message: 'Nodo creado exitosamente'
      });
    }
  } catch (error) {
    console.error('Error al guardar el nodo:', error);
    return NextResponse.json(
      { error: 'Error al guardar el nodo' },
      { status: 500 }
    );
  }
}

// Eliminar un nodo
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const usuario_id = 1; // Ajusta según tu lógica de autenticación

    // Verificar que no sea el nodo raíz
    const [nodo] = await query({
      query: 'SELECT es_raiz FROM organigrama_nodos WHERE id = ?',
      values: [id],
    });

    if (nodo.es_raiz) {
      return NextResponse.json(
        { error: 'No se puede eliminar el nodo raíz' },
        { status: 400 }
      );
    }

    // Marcar como inactivo en lugar de eliminar físicamente
    await query({
      query: 'UPDATE organigrama_nodos SET activo = FALSE WHERE id = ?',
      values: [id],
    });

    // Registrar en historial
    await query({
      query: `
        INSERT INTO organigrama_historial 
        (nodo_id, tipo_cambio, usuario_id)
        VALUES (?, 'ELIMINACION', ?)
      `,
      values: [id, usuario_id],
    });

    return NextResponse.json({ message: 'Nodo eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el nodo:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el nodo' },
      { status: 500 }
    );
  }
} 