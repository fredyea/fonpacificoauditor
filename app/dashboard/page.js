'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const presupuestoItems = [
  { name: 'Adiciones', path: '/dashboard/presupuesto/adiciones' },
  { name: 'Rebajas', path: '/dashboard/presupuesto/rebajas' },
  { name: 'Disponibilidades', path: '/dashboard/presupuesto/disponibilidades' },
  { name: 'Compromisos', path: '/dashboard/presupuesto/compromisos' },
  { name: 'Obligaciones', path: '/dashboard/presupuesto/obligaciones' }
];

const tesoreriaItems = [
  { name: 'Vales', path: '/dashboard/tesoreria/vales' },
  { name: 'Egresos', path: '/dashboard/tesoreria/egresos' },
  { name: 'Facturas', path: '/dashboard/tesoreria/facturas' },
  { name: 'Recaudos', path: '/dashboard/tesoreria/recaudos' }
];

export default function Dashboard() {
  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-4">
        Bienvenido al Sistema SIFP
      </h1>
      <p className="text-gray-300">
        Sistema De información de Fonpacifico
      </p>

    </div>
  );
} 