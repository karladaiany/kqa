import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';

const AccountsPage: React.FC = () => {
  return (
    <DashboardLayout title="Contas">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Minhas Contas</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contas Bancárias</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Nubank</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Conta Corrente</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Saldo</p>
                    <p className="text-lg font-semibold text-green-600">R$ 3.240,75</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Itaú</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Conta Poupança</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Saldo</p>
                    <p className="text-lg font-semibold text-green-600">R$ 2.000,00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountsPage;
