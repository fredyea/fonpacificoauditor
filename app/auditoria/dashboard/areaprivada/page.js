'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const _servidorapi = `${process.env.NEXT_PUBLIC_API_URL}/`;

export default function AreaPrivada() {
  const { userData } = useUser();
  const [tickets, setTickets] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPageTickets, setCurrentPageTickets] = useState(1);
  const [currentPagePermisos, setCurrentPagePermisos] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTickets();
    fetchPermisos();
  }, []);

  const fetchTickets = async () => {
    const idusuario = userData?.id
    try {
      const response = await fetch(_servidorapi + 'maestro_ticketsid?id_usuario=' + idusuario);
      if (!response.ok) throw new Error('Error al cargar tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermisos = async () => {
    const idusuario = userData?.id
    try {
      const response = await fetch(_servidorapi + 'maestro_solictudespermisosid?id_usuario=' + idusuario);
      if (!response.ok) throw new Error('Error al cargar permisos');
      const data = await response.json();
      setPermisos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/avatar-default.png';
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('/')) return avatarPath;
    return `${process.env.NEXT_PUBLIC_API_URLPDF}/${avatarPath}`;
  };

  // Paginación para tickets
  const indexOfLastTicket = currentPageTickets * itemsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPagesTickets = Math.ceil(tickets.length / itemsPerPage);

  // Paginación para permisos
  const indexOfLastPermiso = currentPagePermisos * itemsPerPage;
  const indexOfFirstPermiso = indexOfLastPermiso - itemsPerPage;
  const currentPermisos = permisos.slice(indexOfFirstPermiso, indexOfLastPermiso);
  const totalPagesPermisos = Math.ceil(permisos.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Perfil del Usuario */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4">
          <Image
            src={getAvatarUrl(userData?.avatar)}
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{userData?.nombre || 'Usuario'}</h2>
        <p className="text-gray-400">{userData?.email || 'email@ejemplo.com'}</p>
      </div>

      {/* Mis Tickets */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-4">Mis Tickets</h3>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {currentTickets.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticket</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentTickets.map((ticket) => (
                    <tr key={ticket.id_tiket} className="hover:bg-gray-700">
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">{ticket.id_tiket}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                        {format(new Date(ticket.fecha), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.estado === 1 ? 'bg-yellow-100 text-yellow-800' :
                          ticket.estado === 2 ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.estado === 1 ? 'Pendiente' : ticket.estado === 2 ? 'En Proceso' : 'Cerrado'}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-sm text-gray-300">{ticket.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">Sin tickets pendientes</p>
              </div>
            )}
          </div>
          {/* Paginación Tickets */}
          {currentTickets.length > 0 && (
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-700">
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-300">
                    Mostrando <span className="font-medium">{indexOfFirstTicket + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastTicket, tickets.length)}
                    </span>{' '}
                    de <span className="font-medium">{tickets.length}</span> resultados
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPageTickets(prev => Math.max(prev - 1, 1))}
                    disabled={currentPageTickets === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-gray-300">
                    Página {currentPageTickets} de {totalPagesTickets}
                  </span>
                  <button
                    onClick={() => setCurrentPageTickets(prev => Math.min(prev + 1, totalPagesTickets))}
                    disabled={currentPageTickets === totalPagesTickets}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mis Permisos */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Mis Permisos</h3>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {currentPermisos.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Desde</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Hasta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Motivo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gerencia</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Observación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentPermisos.map((permiso) => (
                    <tr key={permiso.id_solicitud} className="hover:bg-gray-700">
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">{permiso.tipo}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                        {format(new Date(permiso.fecha_desde), 'dd/MM/yyyy', { locale: es })}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                        {format(new Date(permiso.fecha_hasta), 'dd/MM/yyyy', { locale: es })}
                      </td>
                      <td className="px-6 py-2 text-sm text-gray-300">{permiso.motivo}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          permiso.estado === 1 ? 'bg-yellow-100 text-yellow-800' :
                          permiso.estado === 2 ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {permiso.estado === 1 ? 'Pendiente' : permiso.estado === 2 ? 'Aprobado' : 'Rechazado'}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <div className="relative h-6 w-6 rounded-full overflow-hidden">
                            <Image
                              src={getAvatarUrl(permiso.avatargerencia)}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>{permiso.gerencia}</span>
                        </div>
                      </td>
                      <td className="px-6 py-2 text-sm text-gray-300">{permiso.observacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">Sin permisos pendientes</p>
              </div>
            )}
          </div>
          {/* Paginación Permisos */}
          {currentPermisos.length > 0 && (
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-700">
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-300">
                    Mostrando <span className="font-medium">{indexOfFirstPermiso + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastPermiso, permisos.length)}
                    </span>{' '}
                    de <span className="font-medium">{permisos.length}</span> resultados
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPagePermisos(prev => Math.max(prev - 1, 1))}
                    disabled={currentPagePermisos === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-gray-300">
                    Página {currentPagePermisos} de {totalPagesPermisos}
                  </span>
                  <button
                    onClick={() => setCurrentPagePermisos(prev => Math.min(prev + 1, totalPagesPermisos))}
                    disabled={currentPagePermisos === totalPagesPermisos}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 