'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, UserGroupIcon, ClipboardDocumentCheckIcon, BuildingOfficeIcon, DocumentTextIcon, UserIcon, UsersIcon, WalletIcon, BanknotesIcon, CalculatorIcon, UserCircleIcon, WindowIcon } from '@heroicons/react/24/outline';
import { useUser } from './context/UserContext';
import { requestNotificationPermission } from '../lib/firebase';
const md5 = require('md5')

const _servidorapi = process.env.NEXT_PUBLIC_API_URL ? 
  `${process.env.NEXT_PUBLIC_API_URL}/` : 
  '/api/';

console.log('API URL configurada:', _servidorapi);

export default function Home() {
  const router = useRouter();
  const { userData } = useUser();

  // Si el usuario ya está autenticado, redirigir al dashboard correspondiente
  useEffect(() => {
    if (userData) {
      // Aquí puedes agregar la lógica para redirigir según el rol del usuario
      router.push('/ventanilla/dashboard');
    }
  }, [userData, router]);

  const areas = [
    { name: 'Administración', route: '/admin', icon: UserGroupIcon },
    { name: 'Auditoría', route: '/auditoria', icon: ClipboardDocumentCheckIcon },
    { name: 'Alta Gerencia', route: '/gerencia', icon: BuildingOfficeIcon },
    { name: 'Contratación', route: '/contratacion', icon: DocumentTextIcon },
    { name: 'Supervisores', route: '/supervisores', icon: UserIcon },
    { name: 'Asociados', route: '/asociados', icon: UsersIcon },
    { name: 'Cartera', route: '/cartera', icon: WalletIcon },
    { name: 'Tesorería', route: '/tesoreria', icon: BanknotesIcon },
    { name: 'Contabilidad', route: '/contabilidad', icon: CalculatorIcon },
    { name: 'Recursos Humanos', route: '/rrhh', icon: UserCircleIcon },
    { name: 'Ventanilla', route: '/ventanilla', icon: WindowIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Sistema SIFP</h1>
            <p className="text-xl text-gray-300">Seleccione su área de acceso</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area) => (
              <button
                key={area.name}
                onClick={() => router.push(area.route)}
                className="p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 flex flex-col items-center"
              >
                <area.icon className="h-8 w-8 text-white mb-3" />
                <h2 className="text-xl font-semibold text-white">{area.name}</h2>
              </button>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 Sistema SIFP
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
