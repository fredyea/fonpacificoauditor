'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { 
  UserGroupIcon, 
  ClockIcon, 
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const _servidorapi = process.env.NEXT_PUBLIC_API_URL ? 
  `${process.env.NEXT_PUBLIC_API_URL}/` : 
  '/api/';

export default function Page() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fecha, setFecha] = useState('');
  const [terceroSeleccionado, setTerceroSeleccionado] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [terceros, setTerceros] = useState([]);
  const fileInputRef = useRef(null);

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFecha('');
    setTerceroSeleccionado('');
    setArchivo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    limpiarFormulario();
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Cargar la lista de terceros cuando el componente se monta
    const fetchTerceros = async () => {
      try {
        const response = await fetch(`${_servidorapi}maestroterceros`);
        const data = await response.json();
        setTerceros(data);
      } catch (error) {
        console.error('Error al cargar terceros:', error);
        toast.error('Error al cargar la lista de terceros');
      }
    };

    fetchTerceros();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!fecha || !terceroSeleccionado || !archivo) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    const toastId = toast.loading('Guardando factura...');

    try {
      const formData = new FormData();
      formData.append('fecha', fecha);
      formData.append('id_tercero', terceroSeleccionado);
      formData.append('archivo', archivo);

      const response = await fetch(`${_servidorapi}facturas`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al guardar la factura');
      }

      limpiarFormulario();
      setIsModalOpen(false);
      
      toast.success('Factura guardada exitosamente', {
        id: toastId
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la factura', {
        id: toastId
      });
    }
  };

  const cards = [
    {
      name: 'Atención al Asociado',
      description: 'Gestión de atención a los Asociados',
      icon: UserGroupIcon,
      route: '/ventanilla/dashboard/atencion'
    },
    {
      name: 'Gestión Archivos',
      description: 'Control y asignación de turnos',
      icon: ClockIcon,
      route: '/ventanilla/dashboard/turnos'
    },
    {
      name: 'Solicitudes',
      description: 'Manejo de solicitudes y trámites',
      icon: DocumentTextIcon,
      route: '/ventanilla/dashboard/solicitudes'
    },
    {
      name: 'Radicación Facturas',
      description: 'Procesamiento de pagos',
      icon: CurrencyDollarIcon,
      onClick: () => setIsModalOpen(true)
    },
    {
      name: 'Reportes',
      description: 'Informes y estadísticas',
      icon: ChartBarIcon,
      route: '/ventanilla/dashboard/reportes'
    }
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-white">Dashboard Ventanilla</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <div
                  key={card.name}
                  className="relative bg-gray-800 pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  onClick={card.onClick || (() => router.push(card.route))}
                >
                  <div>
                    <div className="absolute bg-amber-500 rounded-md p-3">
                      <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-16 pt-1">
                      <p className="text-sm font-medium text-gray-300 truncate">{card.name}</p>
                      <p className="mt-1 text-xs text-gray-400 truncate">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Radicación de Facturas */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/95 rounded-lg max-w-md w-full p-6 shadow-xl ring-1 ring-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Radicación de Facturas</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Fecha de Radicación
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Tercero
                </label>
                <select
                  value={terceroSeleccionado}
                  onChange={(e) => setTerceroSeleccionado(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                >
                  <option value="">Seleccione un tercero</option>
                  {terceros.map((tercero) => (
                    <option key={tercero.id_tercero} value={tercero.id_tercero}>
                      {tercero.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Archivo
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="mt-1 block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-amber-600 file:text-white
                    hover:file:bg-amber-700"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    if (!fecha || !terceroSeleccionado || !archivo) {
                      toast.error('Por favor complete todos los campos');
                      return;
                    }
                    
                    toast((t) => (
                      <div className="flex flex-col gap-2">
                        <span className="font-medium">¿Está seguro de guardar la factura?</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              toast.dismiss(t.id);
                              handleSubmit();
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ), {
                      duration: Infinity,
                    });
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}