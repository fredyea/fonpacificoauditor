'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../context/UserContext';
const _servidorapi = `${process.env.NEXT_PUBLIC_API_URL}/`

export default function AvatarModal({ isOpen, onClose }) {
  const { userData, updateUserAvatar } = useUser();
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/avatar-default.png';
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('/')) return avatarPath;
    return `${process.env.NEXT_PUBLIC_API_URLPDF}/${avatarPath}`;
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!avatar) return;

    try {
      setIsLoading(true);
      console.log(avatar)
      const formData = new FormData();
      formData.append('image', avatar);
      formData.append('id_usuario', userData?.id);
      
      const response = await fetch(_servidorapi+'pdf/avatarusuariox', {
        method: 'POST',
        body: formData,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Error al actualizar el avatar');
      }

      const data = await response.json();
      updateUserAvatar(data.avatar);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el avatar');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/95 rounded-lg max-w-md w-full p-6 shadow-xl ring-1 ring-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Cambiar Avatar</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={avatar ? URL.createObjectURL(avatar) : getAvatarUrl(userData?.avatar)}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg w-full"
            >
              Seleccionar Imagen
            </button>
            
            <div className="flex gap-4 w-full">
              <button
                onClick={handleUpdateAvatar}
                disabled={!avatar || isLoading}
                className={`flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg ${
                  (!avatar || isLoading) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 