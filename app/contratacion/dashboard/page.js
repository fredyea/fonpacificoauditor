'use client';

export default function ContratacionDashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Panel de Contratación
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-indigo-100 dark:bg-indigo-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-indigo-900 dark:text-indigo-100">Contratos</h2>
          <p className="text-indigo-700 dark:text-indigo-300 mt-2">Gestión de contratos activos</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-green-900 dark:text-green-100">Licitaciones</h2>
          <p className="text-green-700 dark:text-green-300 mt-2">Procesos de licitación</p>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-amber-900 dark:text-amber-100">Proveedores</h2>
          <p className="text-amber-700 dark:text-amber-300 mt-2">Base de datos de proveedores</p>
        </div>
        <div className="bg-rose-100 dark:bg-rose-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-rose-900 dark:text-rose-100">Seguimiento</h2>
          <p className="text-rose-700 dark:text-rose-300 mt-2">Monitoreo de procesos</p>
        </div>
        <div className="bg-cyan-100 dark:bg-cyan-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-cyan-900 dark:text-cyan-100">Documentación</h2>
          <p className="text-cyan-700 dark:text-cyan-300 mt-2">Gestión documental</p>
        </div>
      </div>
    </div>
  );
} 