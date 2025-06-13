'use client';

import LoginBase from '../components/LoginBase';

export default function AdminLogin() {
  return (
    <LoginBase
      title="Acceso Administración"
      loginEndpoint="loginadmin"
      redirectPath="/admin/dashboard"
    />
  );
} 