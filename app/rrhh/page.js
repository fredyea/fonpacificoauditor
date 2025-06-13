'use client';

import LoginBase from '../components/LoginBase';

export default function RRHHLogin() {
  return (
    <LoginBase
      title="Acceso Recursos Humanos"
      loginEndpoint="loginrecursos"
      redirectPath="/rrhh/dashboard"
    />
  );
} 