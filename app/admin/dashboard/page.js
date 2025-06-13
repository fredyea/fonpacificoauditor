'use client';

export default function AdminDashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Panel de Administración
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-blue-900 dark:text-blue-100">Usuarios</h2>
          <p className="text-blue-700 dark:text-blue-300 mt-2">Gestión de usuarios del sistema</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-green-900 dark:text-green-100">Roles</h2>
          <p className="text-green-700 dark:text-green-300 mt-2">Administración de roles y permisos</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-purple-900 dark:text-purple-100">Configuración</h2>
          <p className="text-purple-700 dark:text-purple-300 mt-2">Configuración general del sistema</p>
        </div>
      </div>
    </div>
  );
} 