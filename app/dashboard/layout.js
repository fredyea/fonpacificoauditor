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
import { useUser } from '../context/UserContext';
import AvatarModal from '../components/AvatarModal';
import PasswordModal from '../components/PasswordModal';
import PermissionModal from '../components/PermissionModal';
import TicketModal from '../components/TicketModal';
import ProtectedRoute from '../components/ProtectedRoute';

const presupuestoItems = [
  { name: 'Adiciones', path: '/dashboard/presupuesto/adiciones' },
  { name: 'Rebajas', path: '/dashboard/presupuesto/rebajas' },
  { name: 'Disponibilidades', path: '/dashboard/presupuesto/disponibilidades' },
  { name: 'Compromisos', path: '/dashboard/presupuesto/compromisos' },
  { name: 'Obligaciones', path: '/dashboard/presupuesto/obligaciones' },
  { name: 'Obligaciones Res.', path: '/dashboard/presupuesto/obligacionesres' },
  { name: 'Obligaciones DP', path: '/dashboard/presupuesto/obligacionesdp' }
];

const tesoreriaItems = [
  { name: 'Vales', path: '/dashboard/tesoreria/vales' },
  { name: 'Egresos', path: '/dashboard/tesoreria/egresos' },
  { name: 'Facturas', path: '/dashboard/tesoreria/facturas' },
  { name: 'Recaudos', path: '/dashboard/tesoreria/recaudos' }
];

const audPresupuestoItems = [
  { name: 'Articulos Negativos', path: '/dashboard/auditor/articulosnegativos' },
  { name: 'Disponibilidades Negativas', path: '/dashboard/auditor/disponibilidadesnegativas' },
  { name: 'Compromisos Negativos', path: '/dashboard/auditor/compromisosnegativos' }

];

const audTesoreriaItems = [
  { name: 'Bancos Negativos', path: '/dashboard/auditoria/tesoreria/bancos' },
  { name: 'Facturas otras Vigencias sin Recaudar', path: '/dashboard/auditoria/tesoreria/vales-legalizar' }
];

const audContratacionItems = [
  { name: 'Negocios', path: '/dashboard/auditoria/contratacion/negocios' },
  { name: 'Contratos', path: '/dashboard/auditoria/contratacion/contratos' },
  { name: 'Abogados', path: '/dashboard/auditoria/contratacion/abogados' }
];

const supervisoresItems = [
  { name: 'Contratos Activos', path: '/dashboard/supervisores/contratos-activos' },
  { name: 'Contratos Suspendidos', path: '/dashboard/supervisores/contratos-suspendidos' },
  { name: 'Supervisores', path: '/dashboard/supervisores/lista-supervisores' }
];

const otrosItems = [
  { name: 'Permisos Pendientes', path: '/dashboard/otros/permisospendientes' },
  { name: 'Tickets Pendientes', path: '/dashboard/otros/tiketpendientes' },
  { name: 'Permisos', path: '/dashboard/otros/permisos' },
  { name: 'Tickets', path: '/dashboard/otros/tickets' },
  { name: 'Contabilidad', path: '/dashboard/otros/contabilidad' }
];

export default function DashboardLayout({ children }) {
  const { userData, clearUser } = useUser();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [habilitacionesOpen, setHabilitacionesOpen] = useState(false);
  const [subPresupuestoOpen, setSubPresupuestoOpen] = useState(false);
  const [subTesoreriaOpen, setSubTesoreriaOpen] = useState(false);
  const [audPresupuestoOpen, setAudPresupuestoOpen] = useState(false);
  const [audTesoreriaOpen, setAudTesoreriaOpen] = useState(false);
  const [audContratacionOpen, setAudContratacionOpen] = useState(false);
  const [supervisoresOpen, setSupervisoresOpen] = useState(false);
  const [otrosOpen, setOtrosOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileHabilitacionesOpen, setMobileHabilitacionesOpen] = useState(false);
  const [mobileSubPresupuestoOpen, setMobileSubPresupuestoOpen] = useState(false);
  const [mobileSubTesoreriaOpen, setMobileSubTesoreriaOpen] = useState(false);
  const [mobileAudPresupuestoOpen, setMobileAudPresupuestoOpen] = useState(false);
  const [mobileAudTesoreriaOpen, setMobileAudTesoreriaOpen] = useState(false);
  const [mobileAudContratacionOpen, setMobileAudContratacionOpen] = useState(false);
  const [mobileSupervisoresOpen, setMobileSupervisoresOpen] = useState(false);
  const [mobileOtrosOpen, setMobileOtrosOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Función para cerrar todos los menús
  const closeAllMenus = () => {
    setHabilitacionesOpen(false);
    setSubPresupuestoOpen(false);
    setSubTesoreriaOpen(false);
    setAudPresupuestoOpen(false);
    setAudTesoreriaOpen(false);
    setAudContratacionOpen(false);
    setSupervisoresOpen(false);
    setOtrosOpen(false);
    setUserMenuOpen(false);
  };

  // Función para manejar la URL del avatar
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/avatar-default.png';
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('/')) return avatarPath;
    return `${process.env.NEXT_PUBLIC_API_URLPDF}/${avatarPath}`;
  };

  const handleLogout = async () => {
    try {
      clearUser();
      // Redirigir al login
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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
                  <Link href="/dashboard">
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
                    {/* Habilitaciones Dropdown */}
                    <div className="relative menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Cerrar otros menús pero mantener el estado de habilitaciones
                          setSubTesoreriaOpen(false);
                          setAudPresupuestoOpen(false);
                          setAudTesoreriaOpen(false);
                          setAudContratacionOpen(false);
                          setSupervisoresOpen(false);
                          setOtrosOpen(false);
                          setUserMenuOpen(false);
                          // Toggle el estado de habilitaciones
                          setHabilitacionesOpen(!habilitacionesOpen);
                        }}
                        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Habilitaciones
                      </button>
                      {habilitacionesOpen && (
                        <div className="absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            {/* Presupuesto Submenu */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Solo cerrar otros submenús pero mantener habilitaciones abierto
                                setSubTesoreriaOpen(false);
                                // Toggle el estado de presupuesto
                                setSubPresupuestoOpen(!subPresupuestoOpen);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-amber-300 hover:bg-amber-700 hover:text-white mr-2 rounded-lg"
                            >
                              Presupuesto
                            </button>
                            {subPresupuestoOpen && (
                              <div className="pl-4">
                                {presupuestoItems.map((item) => (
                                  <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`block px-4 py-2 text-sm mr-2 rounded-lg ${
                                      pathname === item.path
                                        ? 'bg-amber-700 text-white'
                                        : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      closeAllMenus();
                                      setSubPresupuestoOpen(false);
                                    }}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                            
                            {/* Tesorería Submenu */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Solo cerrar otros submenús pero mantener habilitaciones abierto
                                setSubPresupuestoOpen(false);
                                // Toggle el estado de tesorería
                                setSubTesoreriaOpen(!subTesoreriaOpen);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-amber-300 hover:bg-amber-700 hover:text-white mr-2 rounded-lg"
                            >
                              Tesorería
                            </button>
                            {subTesoreriaOpen && (
                              <div className="pl-4">
                                {tesoreriaItems.map((item) => (
                                  <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`block px-4 py-2 text-sm mr-2 rounded-lg ${
                                      pathname === item.path
                                        ? 'bg-amber-700 text-white'
                                        : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      closeAllMenus();
                                    }}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Aud. Presupuesto Dropdown */}
                    <div className="relative menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeAllMenus();
                          setAudPresupuestoOpen(!audPresupuestoOpen);
                        }}
                        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Aud. Presupuesto
                      </button>
                      {audPresupuestoOpen && (
                        <div className="absolute z-50 left-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            {audPresupuestoItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.path}
                                className={`block px-4 py-2 text-sm mr-2 rounded-lg ${
                                  pathname === item.path
                                    ? 'bg-amber-700 text-white'
                                    : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                                }`}
                                role="menuitem"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeAllMenus();
                                  setAudPresupuestoOpen(false);
                                }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Aud. Tesorería Dropdown */}
                    <div className="relative menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeAllMenus();
                          setAudTesoreriaOpen(!audTesoreriaOpen);
                        }}
                        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Aud. Tesorería
                      </button>
                      {audTesoreriaOpen && (
                        <div className="absolute z-50 left-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            {audTesoreriaItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.path}
                                className={`block px-4 py-2 text-sm mr-2 rounded-lg ${
                                  pathname === item.path
                                    ? 'bg-amber-700 text-white'
                                    : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                                }`}
                                role="menuitem"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeAllMenus();
                                  setAudTesoreriaOpen(false);
                                }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Aud. Contratación Dropdown */}
                    <div className="relative menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeAllMenus();
                          setAudContratacionOpen(!audContratacionOpen);
                        }}
                        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Aud. Contratación
                      </button>
                      {audContratacionOpen && (
                        <div className="absolute z-50 left-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            {audContratacionItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.path}
                                className={`block px-4 py-2 text-sm mr-2 rounded-lg ${
                                  pathname === item.path
                                    ? 'bg-amber-700 text-white'
                                    : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                                }`}
                                role="menuitem"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeAllMenus();
                                  setAudContratacionOpen(false);
                                }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Supervisores Dropdown */}
                    <div className="relative menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeAllMenus();
                          setSupervisoresOpen(!supervisoresOpen);
                        }}
                        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Supervisores
                      </button>
                      {supervisoresOpen && (
                        <div className="absolute z-50 left-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            {supervisoresItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.path}
                                className={`block px-4 py-2 text-sm mr-2 rounded-lg ${
                                  pathname === item.path
                                    ? 'bg-amber-700 text-white'
                                    : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                                }`}
                                role="menuitem"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeAllMenus();
                                  setSupervisoresOpen(false);
                                }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Otros Dropdown */}
                    <div className="relative menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeAllMenus();
                          setOtrosOpen(!otrosOpen);
                        }}
                        className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Otros
                      </button>
                      {otrosOpen && (
                        <div className="absolute z-50 left-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            {otrosItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.path}
                                className={`block px-4 py-2 text-sm mr-2 rounded-lg ${
                                  pathname === item.path
                                    ? 'bg-amber-700 text-white'
                                    : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                                }`}
                                role="menuitem"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeAllMenus();
                                  setOtrosOpen(false);
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
                          className="flex items-center px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllMenus();
                            setUserMenuOpen(false);
                            setIsAvatarModalOpen(true);
                          }}
                        >
                          <UserCircleIcon className="h-5 w-5 mr-2" />
                          Cambiar Avatar
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllMenus();
                            setUserMenuOpen(false);
                            setIsPasswordModalOpen(true);
                          }}
                        >
                          <LockClosedIcon className="h-5 w-5 mr-2" />
                          Cambiar Clave
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllMenus();
                            setUserMenuOpen(false);
                            setIsPermissionModalOpen(true);
                          }}
                        >
                          <KeyIcon className="h-5 w-5 mr-2" />
                          Solicitar Permiso
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllMenus();
                            setUserMenuOpen(false);
                            setIsTicketModalOpen(true);
                          }}
                        >
                          <TicketIcon className="h-5 w-5 mr-2" />
                          Crear Ticket
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllMenus();
                            setUserMenuOpen(false);
                            router.push('/dashboard/areaprivada');
                          }}
                        >
                          <LockClosedIcon className="h-5 w-5 mr-2" />
                          Área Privada
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllMenus();
                            handleLogout();
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg"
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
                  aria-controls="mobile-menu"
                  aria-expanded={mobileMenuOpen}
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
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Habilitaciones Mobile Menu */}
              <div>
                <button
                  onClick={() => {
                    setMobileHabilitacionesOpen(!mobileHabilitacionesOpen);
                    setMobileAudPresupuestoOpen(false);
                    setMobileAudTesoreriaOpen(false);
                    setMobileAudContratacionOpen(false);
                    setMobileSupervisoresOpen(false);
                    setMobileOtrosOpen(false);
                  }}
                  className="w-full text-left text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
                >
                  <span>Habilitaciones</span>
                  <svg
                    className={`h-5 w-5 transform ${mobileHabilitacionesOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`${mobileHabilitacionesOpen ? 'block' : 'hidden'} pl-4`}>
                  {/* Presupuesto Mobile Submenu */}
                  <button
                    onClick={() => {
                      // Solo toggle el estado de presupuesto, mantener habilitaciones abierto
                      setMobileSubPresupuestoOpen(!mobileSubPresupuestoOpen);
                      setMobileSubTesoreriaOpen(false);
                    }}
                    className="w-full text-left text-amber-300 hover:bg-amber-700 hover:text-white px-3 py-2 rounded-lg mr-2 text-base font-medium"
                  >
                    Presupuesto
                  </button>
                  <div className={`${mobileSubPresupuestoOpen ? 'block' : 'hidden'} pl-4`}>
                    {presupuestoItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`block px-3 py-2 mr-2 rounded-lg text-base font-medium ${
                          pathname === item.path
                            ? 'bg-amber-700 text-white'
                            : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileHabilitacionesOpen(false);
                          setMobileSubPresupuestoOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Tesorería Mobile Submenu */}
                  <button
                    onClick={() => {
                      // Solo toggle el estado de tesorería, mantener habilitaciones abierto
                      setMobileSubTesoreriaOpen(!mobileSubTesoreriaOpen);
                      setMobileSubPresupuestoOpen(false);
                    }}
                    className="w-full text-left text-amber-300 hover:bg-amber-700 hover:text-white px-3 py-2 rounded-lg mr-2 text-base font-medium"
                  >
                    Tesorería
                  </button>
                  <div className={`${mobileSubTesoreriaOpen ? 'block' : 'hidden'} pl-4`}>
                    {tesoreriaItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`block px-3 py-2 mr-2 rounded-lg text-base font-medium ${
                          pathname === item.path
                            ? 'bg-amber-700 text-white'
                            : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileHabilitacionesOpen(false);
                          setMobileSubTesoreriaOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Aud. Tesorería Mobile Menu */}
                  <button
                    onClick={() => {
                      setMobileAudTesoreriaOpen(!mobileAudTesoreriaOpen);
                      setMobileHabilitacionesOpen(false);
                      setMobileAudPresupuestoOpen(false);
                      setMobileAudContratacionOpen(false);
                      setMobileSupervisoresOpen(false);
                    }}
                    className="w-full text-left text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
                  >
                    <span>Aud. Tesorería</span>
                    <svg
                      className={`h-5 w-5 transform ${mobileAudTesoreriaOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`${mobileAudTesoreriaOpen ? 'block' : 'hidden'} pl-4`}>
                    {audTesoreriaItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`block px-3 py-2 mr-2 rounded-lg text-base font-medium ${
                          pathname === item.path
                            ? 'bg-amber-700 text-white'
                            : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileAudTesoreriaOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Aud. Contratación Mobile Menu */}
                  <button
                    onClick={() => {
                      setMobileAudContratacionOpen(!mobileAudContratacionOpen);
                      setMobileHabilitacionesOpen(false);
                      setMobileAudPresupuestoOpen(false);
                      setMobileAudTesoreriaOpen(false);
                      setMobileSupervisoresOpen(false);
                    }}
                    className="w-full text-left text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
                  >
                    <span>Aud. Contratación</span>
                    <svg
                      className={`h-5 w-5 transform ${mobileAudContratacionOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`${mobileAudContratacionOpen ? 'block' : 'hidden'} pl-4`}>
                    {audContratacionItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`block px-3 py-2 mr-2 rounded-lg text-base font-medium ${
                          pathname === item.path
                            ? 'bg-amber-700 text-white'
                            : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileAudContratacionOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Supervisores Mobile Menu */}
                  <button
                    onClick={() => {
                      setMobileSupervisoresOpen(!mobileSupervisoresOpen);
                      setMobileHabilitacionesOpen(false);
                      setMobileAudPresupuestoOpen(false);
                      setMobileAudTesoreriaOpen(false);
                      setMobileAudContratacionOpen(false);
                    }}
                    className="w-full text-left text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
                  >
                    <span>Supervisores</span>
                    <svg
                      className={`h-5 w-5 transform ${mobileSupervisoresOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`${mobileSupervisoresOpen ? 'block' : 'hidden'} pl-4`}>
                    {supervisoresItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`block px-3 py-2 mr-2 rounded-lg text-base font-medium ${
                          pathname === item.path
                            ? 'bg-amber-700 text-white'
                            : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileSupervisoresOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Otros Mobile Menu */}
                  <button
                    onClick={() => {
                      setMobileOtrosOpen(!mobileOtrosOpen);
                      setMobileHabilitacionesOpen(false);
                      setMobileAudPresupuestoOpen(false);
                      setMobileAudTesoreriaOpen(false);
                      setMobileAudContratacionOpen(false);
                      setMobileSupervisoresOpen(false);
                    }}
                    className="w-full text-left text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
                  >
                    <span>Otros</span>
                    <svg
                      className={`h-5 w-5 transform ${mobileOtrosOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`${mobileOtrosOpen ? 'block' : 'hidden'} pl-4`}>
                    {otrosItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`block px-3 py-2 mr-2 rounded-lg text-base font-medium ${
                          pathname === item.path
                            ? 'bg-amber-700 text-white'
                            : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileOtrosOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Mobile Menu */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center px-3 py-2">
                  <div className="relative h-8 w-8 rounded-full bg-gray-700 overflow-hidden mr-3">
                    <Image
                      src={getAvatarUrl(userData?.avatar)}
                      alt="Avatar"
                      fill
                      sizes="32px"
                      priority
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)}
                    className="flex-1 text-left text-white flex items-center justify-between"
                  >
                    <span>{userData?.nombre || 'Usuario'}</span>
                    <svg
                      className={`h-5 w-5 transform ${mobileUserMenuOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <div className={`${mobileUserMenuOpen ? 'block' : 'hidden'} pl-4`}>
                  <button
                    className="flex items-center px-3 py-2 text-base font-medium text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileUserMenuOpen(false);
                      setIsAvatarModalOpen(true);
                    }}
                  >
                    <UserCircleIcon className="h-5 w-5 mr-2" />
                    Cambiar Avatar
                  </button>
                  <button
                    className="flex items-center px-3 py-2 text-base font-medium text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileUserMenuOpen(false);
                      setIsPasswordModalOpen(true);
                    }}
                  >
                    <LockClosedIcon className="h-5 w-5 mr-2" />
                    Cambiar Clave
                  </button>
                  <button
                    className="flex items-center px-3 py-2 text-base font-medium text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileUserMenuOpen(false);
                      setIsPermissionModalOpen(true);
                    }}
                  >
                    <KeyIcon className="h-5 w-5 mr-2" />
                    Solicitar Permiso
                  </button>
                  <button
                    className="flex items-center px-3 py-2 text-base font-medium text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileUserMenuOpen(false);
                      setIsTicketModalOpen(true);
                    }}
                  >
                    <TicketIcon className="h-5 w-5 mr-2" />
                    Crear Ticket
                  </button>
                  <button
                    className="flex items-center px-3 py-2 text-base font-medium text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileUserMenuOpen(false);
                      router.push('/dashboard/area-privada');
                    }}
                  >
                    <LockClosedIcon className="h-5 w-5 mr-2" />
                    Área Privada
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center px-3 py-2 text-base font-medium text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Salir
                  </button>
                </div>
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
                © 2025 Auditoria Sistema SIFP
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