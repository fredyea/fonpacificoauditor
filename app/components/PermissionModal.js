'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
import { sendNotification } from '../../lib/notifications';
const _servidorapi = process.env.NEXT_PUBLIC_API_URL ? 
  `${process.env.NEXT_PUBLIC_API_URL}/` : 
  '/api/';

const PERMISSION_TYPES = [
  { id: 1, label: 'Estudio' },
  { id: 2, label: 'Cita Médica' },
  { id: 3, label: 'Calamidad' }
];

export default function PermissionModal({ isOpen, onClose }) {
  const { userData } = useUser();
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/avatar-default.png';
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('/')) return avatarPath;
    return `${process.env.NEXT_PUBLIC_API_URLPDF}/${avatarPath}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.type || !formData.description || !formData.startDate || 
        !formData.startTime || !formData.endDate || !formData.endTime) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      setError('La fecha/hora de fin debe ser posterior a la fecha/hora de inicio');
      return;
    }

    try {
      setIsLoading(true);
      const requestData = {
        // Información del usuario
        id_usuario: userData?.id,
        
        // Información del permiso
        tipo: parseInt(formData.type),
        motivo: formData.description,
        
        // Fechas del permiso
        fecha_desde: new Date(`${formData.startDate}T${formData.startTime}`).toISOString().slice(0, 19).replace('T', ' '),
        fecha_hasta: new Date(`${formData.endDate}T${formData.endTime}`).toISOString().slice(0, 19).replace('T', ' '),
        
        // Metadatos
        fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      console.log('Enviando datos:', requestData);

      const response = await fetch(_servidorapi + 'solicitudpermisos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      let data;
      const contentType = response.headers.get('content-type');
      const avatarx = getAvatarUrl(userData?.avatar);
      console.log('Avatar URL:', avatarx);

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        console.error('Error del servidor:', data);
        throw new Error(typeof data === 'string' ? data : (data.error || 'Error al solicitar el permiso'));
      }

      // Éxito
      onClose();
      toast.success('Permiso solicitado exitosamente');
      
      // Enviar notificación con el avatar
      const notificationMessage = `El usuario ${userData?.nombre || 'Usuario'} solicitó un permiso`;
      await sendNotification(26, 'Nueva Solicitud de Permiso', notificationMessage, avatarx);
      
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message || 'Error al solicitar el permiso');
      toast.error('Error al solicitar el permiso');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/95 rounded-lg max-w-md w-full p-6 shadow-xl ring-1 ring-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Solicitar Permiso</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Permiso */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Tipo de Permiso
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 appearance-none"
            >
              <option value="">Seleccione un tipo</option>
              {PERMISSION_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Motivo del Permiso
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 resize-none"
              placeholder="Describa el motivo de su solicitud"
            />
          </div>

          {/* Fecha y Hora de Inicio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Hora Inicio
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Fecha y Hora de Fin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Hora Fin
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="text-red-400 text-sm mt-2">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg ${
                isLoading && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Solicitando...' : 'Solicitar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 