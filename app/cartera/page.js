'use client';

import LoginBase from '../components/LoginBase';

export default function CarteraLogin() {
  return (
    <LoginBase
      title="Acceso Cartera"
      loginEndpoint="logincartera"
      redirectPath="/cartera/dashboard"
    />
  );
} 