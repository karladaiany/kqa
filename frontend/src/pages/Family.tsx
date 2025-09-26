import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';

const FamilyPage: React.FC = () => {
  return (
    <DashboardLayout title="Família">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Família</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Membros da Família</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium mr-4">
                    K
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Karla</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Administrador</p>
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

export default FamilyPage;
