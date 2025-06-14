'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../../../components/context/UserContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { sendNotification } from '../../../../../lib/notifications';
const _servidorapi = `${process.env.NEXT_PUBLIC_API_URL}/`
export default function PermisosPendientes() {
  const { userData } = useUser();
  const [permisos, setPermisos] = useState([]);
  const [iddocumento, setIddocumento] = useState(0)
  const[ estados, setEstados] = useState(1)
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState(null);
  const [actionType, setActionType] = useState('');
  const [observacion, setObservacion] = useState('');

  useEffect(() => {
    fetchPermisos();
  }, []);

  const fetchPermisos = async () => {
    try {
      const response = await fetch(_servidorapi+'maestro_solictudespendientes');
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

  const handleAction = (permiso, type) => {
    setIddocumento(permiso.id_solicitud)
    if (type === 'autorizar') {
      setEstados(2)
    } else {setEstados(3)}
    setSelectedPermiso(permiso);
    setActionType(type);
    setObservacion('');
    setIsModalOpen(true);
  };

  
  const handleConfirmsolicitud = async () => {
    if (!observacion.trim()) {
      toast.error('Por favor ingrese una observación');
      return;
    }
    const avatarx = getAvatarUrl(userData?.avatar);
    try {
      // Aquí iría la lógica para procesar la habilitación
      const formdata = new FormData();
      formdata.append('id_solicitud', iddocumento);
      formdata.append('estado', estados);  

      const res = await fetch(_servidorapi + 'habilitarsolicitudpermiso', {
        method: 'POST',
        body: formdata,
      });

      if (!res.ok) {
        throw new Error('Error al habilitar la adición');
      }

      // Enviar notificación al usuario con ID = 1
      try {
        if (estados === 2) {
          const notificationMessage = ` ${userData?.nombre || 'Usuario'} Autorizo tu permiso`;
          await sendNotification(1, 'Solitud Permiso',notificationMessage, avatarx);
        } else {
          const notificationMessage = ` ${userData?.nombre || 'Usuario'} NO autorizo tu permiso`;
          await sendNotification(1, 'Solitud Permiso', notificationMessage, avatarx);
        
        toast.success('Decisión informada al usuario');
      } 
    }
    catch (notificationError) {
        console.error('Error al enviar la notificación:', notificationError);
        // No detenemos el flujo si falla la notificación
      }

      setIsModalOpen(false);
      
      // Recargar los datos después de procesar
      const response = await fetch(_servidorapi+'maestro_solictudespendientes');
      if (!response.ok) throw new Error('Error al cargar permisos');
      const data = await response.json();
      setPermisos(data);
    } catch (error) {
      console.error('Error al procesar la adición:', error);
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
      <h1 className="text-2xl font-bold text-white mb-6">Permisos Pendientes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {permisos.map((permiso) => (
          <div key={permiso.id_solicitud} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
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
                  <p className="text-amber-400">Motivo: {permiso.tipo}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-4 text-xs"> {/* Reduciendo el tamaño de la fuente */}
  <div>
    <span className="text-amber-400 font-medium">Desde:</span>{' '}
    {format(new Date(permiso.fecha_desde), 'dd/MM/yyyy HH:mm', { locale: es })}
  </div>
  <div>
    <span className="text-amber-400 font-medium">Hasta:</span>{' '}
    {format(new Date(permiso.fecha_hasta), 'dd/MM/yyyy HH:mm', { locale: es })}
  </div>
</div>
                <p>
                  <span className="text-amber-400 font-medium">Motivo:</span>{' '}
                  <textarea
  className="text-xs w-full border rounded p-2"
  rows="3"
  value={permiso.motivo || ''}
  readOnly
></textarea>
                </p>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleAction(permiso, 'autorizar')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Autorizar
                </button>
                <button
                  onClick={() => handleAction(permiso, 'rechazar')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Rechazar
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
              {actionType === 'autorizar' ? 'Autorizar' : 'Rechazar'} Permiso
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
                onClick={handleConfirmsolicitud}
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
    </div>
  );
} 