'use client';

import { useState } from 'react';

export default function GerenciaPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Alta Gerencia
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Bienvenido al Panel de Alta Gerencia
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Aquí podrá gestionar y visualizar la información gerencial de la empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 