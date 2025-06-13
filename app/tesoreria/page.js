'use client';

import LoginBase from '../components/LoginBase';

export default function TesoreriaLogin() {
  return (
    <LoginBase
      title="Acceso Tesorería"
      loginEndpoint="logintesoreria"
      redirectPath="/tesoreria/dashboard"
    />
  );
} 