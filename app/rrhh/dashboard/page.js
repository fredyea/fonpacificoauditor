'use client';

export default function RRHHDashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Panel de Recursos Humanos
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-blue-900 dark:text-blue-100">Personal</h2>
          <p className="text-blue-700 dark:text-blue-300 mt-2">Gestión de empleados</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-green-900 dark:text-green-100">Nómina</h2>
          <p className="text-green-700 dark:text-green-300 mt-2">Administración de nómina</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-purple-900 dark:text-purple-100">Vacaciones</h2>
          <p className="text-purple-700 dark:text-purple-300 mt-2">Control de vacaciones y permisos</p>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-orange-900 dark:text-orange-100">Capacitaciones</h2>
          <p className="text-orange-700 dark:text-orange-300 mt-2">Programas de formación</p>
        </div>
        <div className="bg-teal-100 dark:bg-teal-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-teal-900 dark:text-teal-100">Evaluaciones</h2>
          <p className="text-teal-700 dark:text-teal-300 mt-2">Evaluación de desempeño</p>
        </div>
        <div className="bg-rose-100 dark:bg-rose-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-rose-900 dark:text-rose-100">Reclutamiento</h2>
          <p className="text-rose-700 dark:text-rose-300 mt-2">Procesos de selección</p>
        </div>
      </div>
    </div>
  );
} 