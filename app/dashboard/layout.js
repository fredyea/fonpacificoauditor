'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

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

export default function DashboardLayout({ children }) {
  const [presupuestoOpen, setPresupuestoOpen] = useState(false);
  const [tesoreriaOpen, setTesoreriaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePrespuestoOpen, setMobilePrespuestoOpen] = useState(false);
  const [mobileTesoreriaOpen, setMobileTesoreriaOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Aquí puedes agregar la lógica de cierre de sesión
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
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
                    height={32}
                  />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {/* Presupuesto Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setPresupuestoOpen(!presupuestoOpen);
                        setTesoreriaOpen(false);
                      }}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Presupuesto
                    </button>
                    {presupuestoOpen && (
                      <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu">
                          {presupuestoItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.path}
                              className={`block px-4 py-2 text-sm ${
                                pathname === item.path
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              }`}
                              role="menuitem"
                              onClick={() => setPresupuestoOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tesorería Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setTesoreriaOpen(!tesoreriaOpen);
                        setPresupuestoOpen(false);
                      }}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Tesorería
                    </button>
                    {tesoreriaOpen && (
                      <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu">
                          {tesoreriaItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.path}
                              className={`block px-4 py-2 text-sm ${
                                pathname === item.path
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              }`}
                              role="menuitem"
                              onClick={() => setTesoreriaOpen(false)}
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
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:bg-red-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
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
            {/* Presupuesto Mobile Menu */}
            <div>
              <button
                onClick={() => {
                  setMobilePrespuestoOpen(!mobilePrespuestoOpen);
                  setMobileTesoreriaOpen(false);
                }}
                className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
              >
                <span>Presupuesto</span>
                <svg
                  className={`h-5 w-5 transform ${mobilePrespuestoOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`${mobilePrespuestoOpen ? 'block' : 'hidden'} pl-4`}>
                {presupuestoItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === item.path
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobilePrespuestoOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tesorería Mobile Menu */}
            <div>
              <button
                onClick={() => {
                  setMobileTesoreriaOpen(!mobileTesoreriaOpen);
                  setMobilePrespuestoOpen(false);
                }}
                className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex justify-between items-center"
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
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === item.path
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

            {/* Logout Mobile Button */}
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full text-left text-gray-300 hover:bg-red-600 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
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
  );
} 