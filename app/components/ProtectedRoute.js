'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute({ children }) {
  const { userData } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!userData) {
      console.log('Usuario no autenticado, redirigiendo a login...');
      router.push('/');
    }
  }, [userData, router]);

  // Si no hay usuario, no renderizamos nada mientras se realiza la redirección
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si hay usuario, renderizamos el contenido
  return children;
} 