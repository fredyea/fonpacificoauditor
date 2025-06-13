'use client';

import LoginBase from '../components/LoginBase';

export default function VentanillaLogin() {
  return (
    <LoginBase
      title="Acceso Ventanilla"
      loginEndpoint="loginventanilla"
      redirectPath="/ventanilla/dashboard"
    />
  );
} 