'use client';

import { useSearchParams } from 'next/navigation';
import Contratoimpresion from '../../components/contratoImpresion';

export default function ContratoImpresionPage() {
  const searchParams = useSearchParams();
  const idcontrato = searchParams.get('id');

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Contratoimpresion idcontrato={idcontrato} />
      </div>
    </div>
  );
} 