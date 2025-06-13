'use client';

export default function AuditoriaDashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Panel de Auditoría
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-red-900 dark:text-red-100">Presupuesto</h2>
          <p className="text-red-700 dark:text-red-300 mt-2">Auditoría de presupuesto</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-yellow-900 dark:text-yellow-100">Tesorería</h2>
          <p className="text-yellow-700 dark:text-yellow-300 mt-2">Auditoría de tesorería</p>
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-indigo-900 dark:text-indigo-100">Contratación</h2>
          <p className="text-indigo-700 dark:text-indigo-300 mt-2">Auditoría de contratación</p>
        </div>
      </div>
    </div>
  );
} 