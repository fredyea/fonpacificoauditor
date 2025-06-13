'use client';

export default function ContabilidadDashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Panel de Contabilidad
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-blue-900 dark:text-blue-100">Plan Contable</h2>
          <p className="text-blue-700 dark:text-blue-300 mt-2">Gestión del plan de cuentas</p>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-emerald-900 dark:text-emerald-100">Asientos</h2>
          <p className="text-emerald-700 dark:text-emerald-300 mt-2">Registro de asientos contables</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-purple-900 dark:text-purple-100">Balances</h2>
          <p className="text-purple-700 dark:text-purple-300 mt-2">Estados financieros</p>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-amber-900 dark:text-amber-100">Impuestos</h2>
          <p className="text-amber-700 dark:text-amber-300 mt-2">Gestión tributaria</p>
        </div>
        <div className="bg-rose-100 dark:bg-rose-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-rose-900 dark:text-rose-100">Reportes</h2>
          <p className="text-rose-700 dark:text-rose-300 mt-2">Informes contables</p>
        </div>
      </div>
    </div>
  );
} 