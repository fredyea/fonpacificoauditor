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

const rrhhItems = [
  { 
    name: 'Maestros', 
    submenu: [
      { name: 'Areas', path: '/rrhh/dashboard/areas' },
      { name: 'Roles', path: '/rrhh/dashboard/perfiles' }
    ]
  },
  { 
    name: 'Colaboradores', 
    submenu: [
      { name: 'Empleados', path: '/rrhh/dashboard/empleados' },
      { name: 'Contratistas', path: '/rrhh/dashboard/contratistas' },
      { name: 'Aprendices', path: '/rrhh/dashboard/aprendices' },
      { name: 'Voluntarios', path: '/rrhh/dashboard/voluntarios' }
    ]
  },
  { name: 'Organigrama', path: '/rrhh/dashboard/organigrama' },
  { 
    name: 'Workflow', 
    submenu: [
      { name: 'Financiero', path: '/rrhh/dashboard/workflow' },
      { name: 'Contratacion', path: '/rrhh/dashboard/contratistas' },
      { name: 'Supervisore', path: '/rrhh/dashboard/aprendices' }
    ]
  },
  { 
    name: 'Salidas', 
    submenu: [
      { name: 'Laborales', path: '/rrhh/dashboard/empleados' },
      { name: 'Vacaciones', path: '/rrhh/dashboard/empleados' },
      { name: 'Estudio', path: '/rrhh/dashboard/contratistas' },
      { name: 'Salud', path: '/rrhh/dashboard/contratistas' },
      { name: 'Familiares', path: '/rrhh/dashboard/contratistas' },
      { name: 'Calamidades', path: '/rrhh/dashboard/contratistas' },
      { name: 'Otros', path: '/rrhh/dashboard/aprendices' }
    ]
  },
  { name: 'Capacitaciones', path: '/rrhh/dashboard/capacitaciones' }
];

export default function RRHHDashboardLayout({ children }) {
  const router = useRouter();
  const { userData, clearUser } = useUser();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const pathname = usePathname();

  // Función para cerrar todos los menús
  const closeAllMenus = () => {
    setUserMenuOpen(false);
    setActiveSubmenu(null);
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
                  <Link href="/rrhh/dashboard">
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
                    {rrhhItems.map((item) => (
                      <div key={item.name} className="relative menu-container">
                        {item.submenu ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSubmenu(activeSubmenu === item.name ? null : item.name);
                              }}
                              className={`${
                                activeSubmenu === item.name
                                  ? 'bg-green-600 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                            >
                              {item.name}
                              <svg
                                className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
                                  activeSubmenu === item.name ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            {activeSubmenu === item.name && (
                              <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg z-50">
                                <div className="rounded-md ring-1 ring-black ring-opacity-5 mx-1">
                                  <div className="py-1 bg-gray-800 rounded-md" role="menu">
                                    {item.submenu.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.path}
                                        className={`${
                                          pathname === subItem.path
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        } block px-4 py-2 text-sm rounded-md mx-1`}
                                        onClick={() => setActiveSubmenu(null)}
                                      >
                                        {subItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.path}
                            className={`${
                              pathname === item.path
                                ? 'bg-green-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            } px-3 py-2 rounded-md text-sm font-medium block`}
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center">
                <div className="relative menu-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserMenuOpen(false);
                            setIsAvatarModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg"
                        >
                          <UserCircleIcon className="h-5 w-5 mr-2 inline" />
                          Cambiar Avatar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserMenuOpen(false);
                            setIsPasswordModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg"
                        >
                          <LockClosedIcon className="h-5 w-5 mr-2 inline" />
                          Cambiar Clave
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserMenuOpen(false);
                            setIsPermissionModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg"
                        >
                          <KeyIcon className="h-5 w-5 mr-2 inline" />
                          Solicitar Permiso
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserMenuOpen(false);
                            setIsTicketModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg"
                        >
                          <TicketIcon className="h-5 w-5 mr-2 inline" />
                          Crear Ticket
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-amber-200 hover:bg-amber-700 hover:text-white mr-2 rounded-lg"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 inline" />
                          Salir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 