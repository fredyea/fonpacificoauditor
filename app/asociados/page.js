'use client';

import LoginBase from '../components/LoginBase';

export default function AsociadosLogin() {
  return (
    <LoginBase
      title="Acceso Asociados"
      loginEndpoint="loginasociados"
      redirectPath="/asociados/dashboard"
    />
  );
} 