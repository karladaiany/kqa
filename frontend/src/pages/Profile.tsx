import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';

const ProfilePage: React.FC = () => {
  return (
    <DashboardLayout title="Perfil">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Meu Perfil</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informações Pessoais</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-xl mr-4">
                  K
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-lg">Karla</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">demo@financaspro.com</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                  <input 
                    type="text" 
                    value="Karla" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    value="demo@financaspro.com" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
