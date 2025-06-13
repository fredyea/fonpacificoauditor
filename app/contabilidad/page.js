'use client';

import LoginBase from '../components/LoginBase';

export default function ContabilidadLogin() {
  return (
    <LoginBase
      title="Acceso Contabilidad"
      loginEndpoint="logincontabilidad"
      redirectPath="/contabilidad/dashboard"
    />
  );
} 