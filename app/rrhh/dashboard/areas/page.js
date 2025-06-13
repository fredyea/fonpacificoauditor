'use client';

import { useState, useEffect, Fragment } from 'react';
import ContentLayout from '../../../components/ContentLayout';
import { Transition, Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

const _servidorapi = `${process.env.NEXT_PUBLIC_API_URL}/`




export default function AreaPrivada() {
  const [datos, setDatos] = useState([]);
  const [ramas, setRamas] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 15;
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [iddocumento, setIddocumento] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRamaName, setNewRamaName] = useState('');
  const [showConfirmCreateModal, setShowConfirmCreateModal] = useState(false);
  const [selectedRamaId, setSelectedRamaId] = useState('');

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleProcess = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  
  const handleCreateClase = async () => {
    const requestData = {
      nombre: newRamaName,
      id_rama: selectedRamaId
    };

    try {
      const response = await fetch(_servidorapi + 'insertarrharea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear el dato');
      }
      
      await fetchDatos();
      setShowConfirmCreateModal(false);
      setShowCreateModal(false);
      setNewRamaName('');
      setSelectedRamaId('');
      toast.success('Dato creado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear el Dato. Por favor, intente nuevamente.');
    }
  };
  const handleConfirm = async () => {
    try {
      const response = await fetch(_servidorapi + 'borrarrharea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_area: selectedId }),
      });
      
      if (!response.ok) {
        throw new Error('Error al inhabilitar el Dato');
      }
      
      // Actualizar los datos después de la operación
      await fetchDatos();
      setShowModal(false);
      toast.success('Dato inhabilitado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al inhabilitar el dato. Por favor, intente nuevamente.');
    }
  };

  const fetchDatos = async () => {
    try {
      const response = await fetch(_servidorapi + 'maestrorhareas');
      if (!response.ok) throw new Error('Error al cargar el dato');
      const data = await response.json();
      setDatos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewRamaName(item.nombre);
    setShowEditModal(true);
  };


  // Filtrar datos basado en el término de búsqueda
  const filteredData = datos.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calcular páginas totales
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Obtener datos de la página actual
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  

  const handleCreateRama = async () => {
    try {
      const response = await fetch(_servidorapi + 'insertarrharea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: newRamaName }),
      });
      
      if (!response.ok) throw new Error('Error al crear el dato');
      
      await fetchDatos();
      setShowConfirmCreateModal(false);
      setShowCreateModal(false);
      setNewRamaName('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateDato = async () => {
    const requestData = {
      nombre: newRamaName,
      id_rama: selectedRamaId
    };

    try {
      const response = await fetch(_servidorapi + 'insertarrharea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear el dato');
      }
      
      await fetchDatos();
      setShowConfirmCreateModal(false);
      setShowCreateModal(false);
      setNewRamaName('');
      setSelectedRamaId('');
      toast.success('Dato creado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear el dato. Por favor, intente nuevamente.');
    }
  };

  const handleConfirmEdit = async () => {
    try {
      const response = await fetch(_servidorapi + 'editarrharea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id_area: editingItem.id_area,
          nombre: newRamaName
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el dato');
      }
      
      await fetchDatos();
      setShowEditModal(false);
      setEditingItem(null);
      setNewRamaName('');
      toast.success('Dato actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el dato Por favor, intente nuevamente.');
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <ContentLayout title="Maestro de areas en la empresa">
      <div className="space-y-4">
        {/* Barra de búsqueda y botón crear */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Crear Nueva Area
          </button>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-6">
                        Nombre
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 text-sm font-semibold text-gray-300 sm:pr-6">
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-900">
                    {currentData.map((item, index) => (
                      <tr 
                        key={item.id_area}
                      
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-300 sm:pl-6">
                          {item.nombre}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleProcess(item.id_area)}
                              className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                                ${item.estado !== 0 
                                  ? 'bg-green-600 hover:bg-green-500 focus:ring-green-500' 
                                  : 'bg-red-600 hover:bg-red-500 cursor-not-allowed focus:ring-red-500'}`}
                              disabled={item.estado === 0}
                            >
                              Inhabilitar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between border-t border-gray-700 bg-gray-800 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> de{' '}
                <span className="font-medium">{filteredData.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-600 hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-600 focus:outline-offset-0">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-600 hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Modal para crear nueva clase */}
        <Transition appear show={showCreateModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => {}}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px]" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800/95 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white mb-4"
                    >
                      Crear Nueva Area
                    </Dialog.Title>
                    <div className="mt-2 space-y-4">

                      <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
                          Nombre del area
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          value={newRamaName}
                          onChange={(e) => setNewRamaName(e.target.value)}
                          placeholder="Nombre del sector"
                          className="block w-full rounded-md border-0 bg-gray-700 py-1.5 px-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                      
                    </div>

                    <div className="mt-4 flex space-x-4">
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          setShowCreateModal(false);
                          setShowConfirmCreateModal(true);
                        }}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          setShowCreateModal(false);
                          setNewRamaName('');
                          setSelectedRamaId('');
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Modal de confirmación para crear */}
        <Transition appear show={showConfirmCreateModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => {}}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px]" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800/95 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white mb-4"
                    >
                      Confirmar Creación
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        ¿Está seguro que desea crear el sector {newRamaName} ?
                      </p>
                    </div>

                    <div className="mt-4 flex space-x-4">
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleCreateClase}
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={() => setShowConfirmCreateModal(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Modal de confirmación usando Headless UI */}
        <Transition appear show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => {}}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px]" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800/95 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white mb-4"
                    >
                      Confirmar Inhabilitación
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        ¿Está seguro que desea inhabilitar el sector?
                      </p>
                    </div>

                    <div className="mt-4 flex space-x-4">
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={handleConfirm}
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={() => setShowModal(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <Transition appear show={showEditModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => {}}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px]" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800/95 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white mb-4"
                    >
                      Editar Area
                    </Dialog.Title>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={newRamaName}
                        onChange={(e) => setNewRamaName(e.target.value)}
                        className="block w-full rounded-md border-0 bg-gray-700 py-1.5 px-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="Nombre de la categoría"
                      />
                    </div>

                    <div className="mt-4 flex space-x-4">
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleConfirmEdit}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingItem(null);
                          setNewRamaName('');
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </ContentLayout>
  );
} 