import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';

const CategoriesPage: React.FC = () => {
  return (
    <DashboardLayout title="Categorias">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Categorias</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categorias de Despesas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-500 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Moradia</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Despesa</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-pink-500 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Alimentação</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Despesa</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Transporte</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Despesa</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Saúde</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Despesa</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Lazer</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Despesa</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Educação</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Despesa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categorias de Receitas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-600 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Receita</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receita</p>
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

export default CategoriesPage;
