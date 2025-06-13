'use client';

export default function GerenciaDashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Panel de Alta Gerencia
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-emerald-100 dark:bg-emerald-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-emerald-900 dark:text-emerald-100">Indicadores</h2>
          <p className="text-emerald-700 dark:text-emerald-300 mt-2">KPIs y métricas clave</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-blue-900 dark:text-blue-100">Reportes Financieros</h2>
          <p className="text-blue-700 dark:text-blue-300 mt-2">Estados financieros y análisis</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-purple-900 dark:text-purple-100">Proyecciones</h2>
          <p className="text-purple-700 dark:text-purple-300 mt-2">Análisis predictivo y tendencias</p>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-orange-900 dark:text-orange-100">Decisiones Estratégicas</h2>
          <p className="text-orange-700 dark:text-orange-300 mt-2">Gestión de decisiones clave</p>
        </div>
        <div className="bg-teal-100 dark:bg-teal-900 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-teal-900 dark:text-teal-100">Seguimiento Objetivos</h2>
          <p className="text-teal-700 dark:text-teal-300 mt-2">Monitoreo de metas estratégicas</p>
        </div>
      </div>
    </div>
  );
} 