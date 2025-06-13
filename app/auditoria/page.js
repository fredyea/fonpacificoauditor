'use client';

import LoginBase from '../components/LoginBase';

export default function AuditoriaLogin() {
  return (
    <LoginBase
      title="Acceso Auditoría"
      loginEndpoint="loginauditoria"
      redirectPath="/auditoria/dashboard"
    />
  );
} 