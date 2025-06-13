'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../context/UserContext';
import { sendNotification } from '../../lib/notifications';
import toast from 'react-hot-toast';
const _servidorapi = process.env.NEXT_PUBLIC_API_URL ? 
  `${process.env.NEXT_PUBLIC_API_URL}/` : 
  '/api/';

export default function TicketModal({ isOpen, onClose }) {
  const { userData } = useUser();
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/avatar-default.png';
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('/')) return avatarPath;
    return `${process.env.NEXT_PUBLIC_API_URLPDF}/${avatarPath}`;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('El motivo es obligatorio');
      return;
    }

    try {
      setIsLoading(true);
      const requestData = {
        // Información del usuario
        id_usuario: userData?.id,
        descripcion: description,
        fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      console.log('Enviando datos:', requestData);

      const response = await fetch(_servidorapi + 'tiketnuevo', {
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
        throw new Error(typeof data === 'string' ? data : (data.error || 'Error al solicitar el Ticket'));
      }

      // Éxito
      onClose();
      toast.success('Ticket enviado exitosamente');
      
      // Enviar notificación con el avatar
      const notificationMessage = `El usuario ${userData?.nombre || 'Usuario'} solicitó un Ticket`;
      await sendNotification(26, 'Nueva Ticket enviado', notificationMessage, avatarx);
      
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message || 'Error al solicitar el Ticket');
      toast.error('Error al solicitar el Ticket');
    } finally {
      setIsLoading(false);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/95 rounded-lg max-w-md w-full p-6 shadow-xl ring-1 ring-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Crear Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Descripción del Ticket */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Motivo del Ticket
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError('');
              }}
              rows="4"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 resize-none"
              placeholder="Describa el motivo de su ticket"
            />
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
              {isLoading ? 'Enviando...' : 'Enviar'}
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