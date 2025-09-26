import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';

const CardsPage: React.FC = () => {
  return (
    <DashboardLayout title="Cartões">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cartões de Crédito</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meus Cartões</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Nubank</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Limite: R$ 8.000,00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Utilizado</p>
                    <p className="text-lg font-semibold text-red-600">R$ 5.200,00</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">65%</p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Itaú</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Limite: R$ 5.000,00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Utilizado</p>
                    <p className="text-lg font-semibold text-red-600">R$ 1.500,00</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">30%</p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CardsPage;
