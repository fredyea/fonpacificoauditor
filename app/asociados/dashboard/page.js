'use client';

export default function AsociadosDashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Panel de Asociados
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-indigo-100 dark:bg-indigo-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-indigo-900 dark:text-indigo-100">Mi Perfil</h2>
          <p className="text-indigo-700 dark:text-indigo-300 mt-2">Información personal</p>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-emerald-900 dark:text-emerald-100">Mis Contratos</h2>
          <p className="text-emerald-700 dark:text-emerald-300 mt-2">Contratos activos</p>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-amber-900 dark:text-amber-100">Pagos</h2>
          <p className="text-amber-700 dark:text-amber-300 mt-2">Estado de pagos</p>
        </div>
        <div className="bg-violet-100 dark:bg-violet-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-violet-900 dark:text-violet-100">Documentos</h2>
          <p className="text-violet-700 dark:text-violet-300 mt-2">Documentación personal</p>
        </div>
        <div className="bg-rose-100 dark:bg-rose-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-rose-900 dark:text-rose-100">Solicitudes</h2>
          <p className="text-rose-700 dark:text-rose-300 mt-2">Gestión de solicitudes</p>
        </div>
      </div>
    </div>
  );
} 