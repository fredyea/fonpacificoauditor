'use client';

import { useState } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
const md5 = require('md5');

const _servidorapi = process.env.NEXT_PUBLIC_API_URL ? 
  `${process.env.NEXT_PUBLIC_API_URL}/` : 
  '/api/';

export default function PasswordModal({ isOpen, onClose }) {
  const { userData } = useUser();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (formData.newPassword.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    const passwordNueva = md5(formData.newPassword);
    const passwordAnterior = md5(formData.currentPassword);

    

    try {
      setIsLoading(true);
      console.log('Paso 1')
      const url = _servidorapi + 'loginsoulweb2/?id_usuario=' + encodeURIComponent(userData?.id);
      console.log('Paso 2')
      const response = await fetch(url, { method: 'GET' });
      console.log('Paso 3')
      const data2 = await response.json();
      console.log(data2)

    if (data2[0] && data2[0].clave2) {

      const clave = data2[0].clave2;

      if (clave === passwordAnterior) {

          actualizarClave(passwordNueva);
          
      } else {

        clavenovalida();
        return null;
      }
    }
      // Éxito
      onClose();
    } catch (error) {
      setError(error.message || 'Error al actualizar la contraseña');
      toast.error('Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const clavenovalida = () => {
    toast.error('La contraseña actual es incorrecta');
    setError('La contraseña actual es incorrecta');
  };

  const actualizarClave = async (xpasswordNueva) => {
    const formdatap = new FormData();
    formdatap.append('id_usuario', userData?.id);
    formdatap.append('clave2', xpasswordNueva);
    fetch(_servidorapi + 'actualizarclaveusuario2', {
      method: 'POST',
      body: formdatap
    })
    .then(res => res.text())
    .then(() => {
      toast.success('Contraseña actualizada exitosamente');
      onClose();
    })
    .catch(err => {
      console.error(err);
      toast.error('Error al actualizar la contraseña');
    });
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };


  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/95 rounded-lg max-w-md w-full p-6 shadow-xl ring-1 ring-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Cambiar Contraseña</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contraseña Actual */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 pr-10"
                placeholder="Ingrese su contraseña actual"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.current ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 pr-10"
                placeholder="Ingrese la nueva contraseña"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.new ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 pr-10"
                placeholder="Confirme la nueva contraseña"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.confirm ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
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
              {isLoading ? 'Actualizando...' : 'Actualizar'}
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