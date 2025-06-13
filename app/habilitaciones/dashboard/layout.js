'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  KeyIcon,
  TicketIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { useUser } from '../../context/UserContext';
import AvatarModal from '../../components/AvatarModal';
import PasswordModal from '../../components/PasswordModal';
import PermissionModal from '../../components/PermissionModal';
import TicketModal from '../../components/TicketModal';
import ProtectedRoute from '../../components/ProtectedRoute';

const presupuestoItems = [
  { name: 'Adiciones', path: '/habilitaciones/dashboard/presupuesto/adiciones' },
  { name: 'Rebajas', path: '/habilitaciones/dashboard/presupuesto/rebajas' },
  { name: 'Disponibilidades', path: '/habilitaciones/dashboard/presupuesto/disponibilidades' },
  { name: 'Compromisos', path: '/habilitaciones/dashboard/presupuesto/compromisos' },
  { name: 'Obligaciones', path: '/habilitaciones/dashboard/presupuesto/obligaciones' },
  { name: 'Obligaciones Res.', path: '/habilitaciones/dashboard/presupuesto/obligacionesres' },
  { name: 'Obligaciones DP', path: '/habilitaciones/dashboard/presupuesto/obligacionesdp' }
];

const tesoreriaItems = [
  { name: 'Vales', path: '/habilitaciones/dashboard/tesoreria/vales' },
  { name: 'Egresos', path: '/habilitaciones/dashboard/tesoreria/egresos' },
  { name: 'Facturas', path: '/habilitaciones/dashboard/tesoreria/facturas' },
  { name: 'Recaudos', path: '/habilitaciones/dashboard/tesoreria/recaudos' }
];

export default function HabilitacionesDashboardLayout({ children }) {
  const router = useRouter();
  const { userData, clearUser } = useUser();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [presupuestoOpen, setPresupuestoOpen] = useState(false);
  const [tesoreriaOpen, setTesoreriaOpen] = useState(false);
  const [mobilePresupuestoOpen, setMobilePresupuestoOpen] = useState(false);
  const [mobileTesoreriaOpen, setMobileTesoreriaOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      clearUser();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para obtener la URL del avatar
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/avatar-default.png';
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('/')) return avatarPath;
    return `${process.env.NEXT_PUBLIC_API_URLPDF}/${avatarPath}`;
  };

  // Función para cerrar todos los menús
  const closeAllMenus = () => {
    setPresupuestoOpen(false);
    setTesoreriaOpen(false);
    setUserMenuOpen(false);
  };

  // Manejador de clicks fuera de los menús
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-container')) {
        closeAllMenus();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-900">
        <AvatarModal 
          isOpen={isAvatarModalOpen} 
          onClose={() => setIsAvatarModalOpen(false)} 
        />
        <PasswordModal 
          isOpen={isPasswordModalOpen} 
          onClose={() => setIsPasswordModalOpen(false)} 
        />
        <PermissionModal 
          isOpen={isPermissionModalOpen} 
          onClose={() => setIsPermissionModalOpen(false)} 
        />
        <TicketModal 
          isOpen={isTicketModalOpen} 
          onClose={() => setIsTicketModalOpen(false)} 
        />

        {/* Navigation */}
        <nav className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/habilitaciones/dashboard">
                    <Image
                      className="h-8 w-auto"
                      src="/logo.png"
                      alt="Logo"
                      width={100}
                      height={50}
                    />
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {/* Presupuesto Dropdown */}
                    <div className="relative menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTesoreriaOpen(false);
                          setPresupuestoOpen(!presupuestoOpen);
                        }}
                        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Presupuesto
                      </button>
                      {presupuestoOpen && (
                        <div className="absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            {presupuestoItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.path}
                                className={`block px-4 py-2 text-sm mr-2 rounded-lg ${
                                  pathname === item.path
                                    ? 'bg-green-700 text-white'
                                    : 'text-green-200 hover:bg-green-700 hover:text-white'
                                }`}
                                onClick={() => {
                                  closeAllMenus();
                                  setPresupuestoOpen(false);
                                }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tesorería Dropdown */}
                    <div className="relative menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPresupuestoOpen(false);
                          setTesoreriaOpen(!tesoreriaOpen);
                        }}
                        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Tesorería
                      </button>
                      {tesoreriaOpen && (
                        <div className="absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            {tesoreriaItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.path}
                                className={`block px-4 py-2 text-sm mr-2 rounded-lg ${
                                  pathname === item.path
                                    ? 'bg-green-700 text-white'
                                    : 'text-green-200 hover:bg-green-700 hover:text-white'
                                }`}
                                onClick={() => {
                                  closeAllMenus();
                                  setTesoreriaOpen(false);
                                }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center">
                <div className="relative menu-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeAllMenus();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className="flex items-center space-x-3 text-white hover:opacity-80"
                  >
                    <div className="relative h-8 w-8 rounded-full bg-gray-700 overflow-hidden">
                      <Image
                        src={getAvatarUrl(userData?.avatar)}
                        alt="Avatar"
                        fill
                        sizes="32px"
                        priority
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{userData?.nombre || 'Usuario'}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1" role="menu">
                        <button
                          className="flex items-center px-4 py-2 text-sm text-green-200 hover:bg-green-700 hover:text-white mr-2 rounded-lg w-full"
                          onClick={() => {
                            closeAllMenus();
                            setUserMenuOpen(false);
                            setIsAvatarModalOpen(true);
                          }}
                        >
                          <UserCircleIcon className="h-5 w-5 mr-2" />
                          Cambiar Avatar
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-green-200 hover:bg-green-700 hover:text-white mr-2 rounded-lg w-full"
                          onClick={() => {
                            closeAllMenus();
                            setUserMenuOpen(false);
                            setIsPasswordModalOpen(true);
                          }}
                        >
                          <LockClosedIcon className="h-5 w-5 mr-2" />
                          Cambiar Clave
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-green-200 hover:bg-green-700 hover:text-white mr-2 rounded-lg w-full"
                          onClick={() => {
                            closeAllMenus();
                            setUserMenuOpen(false);
                            setIsPermissionModalOpen(true);
                          }}
                        >
                          <KeyIcon className="h-5 w-5 mr-2" />
                          Solicitar Permiso
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-green-200 hover:bg-green-700 hover:text-white mr-2 rounded-lg w-full"
                          onClick={() => {
                            closeAllMenus();
                            setUserMenuOpen(false);
                            setIsTicketModalOpen(true);
                          }}
                        >
                          <TicketIcon className="h-5 w-5 mr-2" />
                          Crear Ticket
                        </button>
                        <button
                          onClick={() => {
                            closeAllMenus();
                            handleLogout();
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-green-200 hover:bg-green-700 hover:text-white mr-2 rounded-lg"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                          Salir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Abrir menú principal</span>
                  {mobileMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Presupuesto Mobile Menu */}
              <button
                onClick={() => {
                  setMobilePresupuestoOpen(!mobilePresupuestoOpen);
                  setMobileTesoreriaOpen(false);
                }}
                className="w-full text-left text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
              >
                <span>Presupuesto</span>
                <svg
                  className={`h-5 w-5 transform ${mobilePresupuestoOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`${mobilePresupuestoOpen ? 'block' : 'hidden'} pl-4`}>
                {presupuestoItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`block px-3 py-2 mr-2 rounded-lg text-base font-medium ${
                      pathname === item.path
                        ? 'bg-green-700 text-white'
                        : 'text-green-200 hover:bg-green-700 hover:text-white'
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobilePresupuestoOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Tesorería Mobile Menu */}
              <button
                onClick={() => {
                  setMobileTesoreriaOpen(!mobileTesoreriaOpen);
                  setMobilePresupuestoOpen(false);
                }}
                className="w-full text-left text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
              >
                <span>Tesorería</span>
                <svg
                  className={`h-5 w-5 transform ${mobileTesoreriaOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`${mobileTesoreriaOpen ? 'block' : 'hidden'} pl-4`}>
                {tesoreriaItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`block px-3 py-2 mr-2 rounded-lg text-base font-medium ${
                      pathname === item.path
                        ? 'bg-green-700 text-white'
                        : 'text-green-200 hover:bg-green-700 hover:text-white'
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileTesoreriaOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile user menu */}
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="relative h-8 w-8 rounded-full bg-gray-700 overflow-hidden">
                    <Image
                      src={getAvatarUrl(userData?.avatar)}
                      alt="Avatar"
                      fill
                      sizes="32px"
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{userData?.nombre || 'Usuario'}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAvatarModalOpen(true);
                  }}
                >
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  Cambiar Avatar
                </button>
                <button
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsPasswordModalOpen(true);
                  }}
                >
                  <LockClosedIcon className="h-5 w-5 mr-2" />
                  Cambiar Clave
                </button>
                <button
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsPermissionModalOpen(true);
                  }}
                >
                  <KeyIcon className="h-5 w-5 mr-2" />
                  Solicitar Permiso
                </button>
                <button
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsTicketModalOpen(true);
                  }}
                >
                  <TicketIcon className="h-5 w-5 mr-2" />
                  Crear Ticket
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 w-full"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Salir
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
            <div className="px-2 py-4 sm:px-0">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2025 Habilitaciones Sistema SIFP
              </div>
              <div className="text-gray-400 text-sm">
                Versión 1.0
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
} 