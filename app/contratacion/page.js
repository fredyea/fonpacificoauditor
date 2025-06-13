'use client';

import LoginBase from '../components/LoginBase';

export default function ContratacionLogin() {
  return (
    <LoginBase
      title="Acceso Contratación"
      loginEndpoint="logincontratacion"
      redirectPath="/contratacion/dashboard"
    />
  );
} 