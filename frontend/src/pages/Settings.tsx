import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [autoBackup, setAutoBackup] = React.useState(true);

  const handleChangePassword = () => {
    alert('Funcionalidade de alteração de senha será implementada em breve!');
  };

  const handleTwoFactorAuth = () => {
    alert('Funcionalidade de autenticação de dois fatores será implementada em breve!');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    alert('Funcionalidade de tema escuro será implementada em breve!');
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    alert('Configuração de notificações atualizada!');
  };

  const toggleAutoBackup = () => {
    setAutoBackup(!autoBackup);
    alert('Configuração de backup automático atualizada!');
  };

  return (
    <DashboardLayout title="Configurações">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Configurações</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferências</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Modo Escuro</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ativar tema escuro</p>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Notificações</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receber notificações por email</p>
                </div>
                <button 
                  onClick={toggleNotifications}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Backup Automático</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fazer backup dos dados automaticamente</p>
                </div>
                <button 
                  onClick={toggleAutoBackup}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoBackup ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`}></span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Segurança</h3>
            <div className="space-y-4">
              <button 
                onClick={handleChangePassword}
                className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">Alterar Senha</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Atualizar sua senha de acesso</p>
              </button>
              
              <button 
                onClick={handleTwoFactorAuth}
                className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">Autenticação de Dois Fatores</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adicionar camada extra de segurança</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
