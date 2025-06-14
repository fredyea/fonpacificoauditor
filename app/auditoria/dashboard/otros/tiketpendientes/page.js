'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { sendNotification } from '../../../../lib/notifications';
const _servidorapi = `${process.env.NEXT_PUBLIC_API_URL}/`

export default function TiketPendientes() {
  const { userData } = useUser();
  const [permisos, setPermisos] = useState([]);
  const [iddocumento, setIddocumento] = useState(0)
  const [estados, setEstados] = useState(1)
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState(null);
  const [actionType, setActionType] = useState('');
  const [observacion, setObservacion] = useState('');
  const [isEscalarModalOpen, setIsEscalarModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState('');
  const [descripcionEscalar, setDescripcionEscalar] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    fetchPermisos();
    fetchUsuarios();
  }, []);

  const fetchPermisos = async () => {
    try {
      const response = await fetch(_servidorapi+'maestro_ticketpendientes');
      if (!response.ok) throw new Error('Error al cargar permisos');
      const data = await response.json();
      setPermisos(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los permisos pendientes');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(_servidorapi + 'usuariosadministradores');
      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar la lista de usuarios');
    }
  };

  const handleAction = (permiso, type) => {
    setIddocumento(permiso.id_tiket)
    setIsModalOpen(true);
  };

  const handleEscalar = () => {
    
    if (!selectedUsuario) {
      toast.error('Por favor seleccione un usuario');
      return;
    }
    if (!descripcionEscalar.trim()) {
      toast.error('Por favor ingrese una descripción');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmEscalar = async () => {
    const avatarx = getAvatarUrl(userData?.avatar);
    const fechax = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
      const response = await fetch(_servidorapi + 'escalartiket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_tiket: selectedPermiso.id_tiket,
          id_parausuario: selectedUsuario,
          escalo:userData?.id,
          fecha: fechax,
          observacion: descripcionEscalar,

          id_usuarioescalo: userData?.id
        }),
      });

      if (!response.ok) throw new Error('Error al escalar el ticket');

      toast.success('Ticket escalado exitosamente');
      const notificationMessage = ` ${userData?.nombre || 'Usuario'} Te escalo un ticket`;
      await sendNotification(selectedUsuario, 'Ticket Escalado', notificationMessage, avatarx);
      setIsEscalarModalOpen(false);
      setIsConfirmModalOpen(false);
      await fetchPermisos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al escalar el ticket');
    }
  };

  const handleConfirmarcerrar = async () => {
    if (!observacion.trim()) {
      toast.error('Por favor ingrese la solución');
      return;
    }
    const avatarx = getAvatarUrl(userData?.avatar);
    try {
      const fechax = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const formdata = new FormData();
      formdata.append('id_tiket', iddocumento);
      formdata.append('estado', 3); 
      formdata.append('solucion', observacion);  
      formdata.append('fecha_cerrado', fechax);
      formdata.append('id_usuariocerro', userData?.id);

      const res = await fetch(_servidorapi + 'cerrartiket', {
        method: 'POST',
        body: formdata,
      });

      if (!res.ok) {
        throw new Error('Error cerrar el ticket');
      }

      const notificationMessage = ` ${userData?.nombre || 'Usuario'} Te cerro un Ticket`;
      await sendNotification(1, 'Ticket Cerrado', notificationMessage, avatarx);
      
      toast.success('Ticket Cerrado');
      await fetchPermisos();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al procesar la adición:', error);
      toast.error('Error al cerrar el ticket');
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/avatar-default.png';
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('/')) return avatarPath;
    return `${process.env.NEXT_PUBLIC_API_URLPDF}/${avatarPath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Ticket Pendientes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {permisos.map((permiso) => (
          <div key={permiso.id_tiket} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={getAvatarUrl(permiso.avatar)}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{permiso.usuario}</h3>
                  <p className="text-amber-400">Fecha:  {format(new Date(permiso.fecha), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-amber-400 font-medium">Solicita:</span>{' '}
                  <textarea
  className="text-xs w-full border rounded p-2"
  rows="5"
  value={permiso.descripcion || ''}
  readOnly
></textarea>
                </p>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedPermiso(permiso);
                    setIsEscalarModalOpen(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Escalar
                </button>
                <button
                  onClick={() => handleAction(permiso, 'rechazar')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              Cerrar Ticket
            </h2>
            <div className="mb-4">
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Observación
              </label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="4"
                placeholder="Ingrese su observación..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarcerrar}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  actionType === 'autorizar'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Escalamiento */}
      {isEscalarModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Escalar Ticket</h2>
            <div className="mb-4">
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Seleccionar Usuario
              </label>
              <select
                value={selectedUsuario}
                onChange={(e) => setSelectedUsuario(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombres}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={descripcionEscalar}
                onChange={(e) => setDescripcionEscalar(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="4"
                placeholder="Ingrese la descripción del escalamiento..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEscalarModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEscalar}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Escalar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Escalamiento */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Confirmar Escalamiento</h2>
            <p className="text-gray-300 mb-4">
              ¿Está seguro que desea escalar este ticket al usuario seleccionado?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmEscalar}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 