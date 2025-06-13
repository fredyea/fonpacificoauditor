'use client';

import LoginBase from '../components/LoginBase';

export default function SupervisoresLogin() {
  return (
    <LoginBase
      title="Acceso Supervisores"
      loginEndpoint="loginsupervisores"
      redirectPath="/supervisores/dashboard"
    />
  );
} 