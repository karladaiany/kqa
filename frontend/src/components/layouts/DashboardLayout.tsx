import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Home, FileText, CreditCard, Landmark, Tag, Users, Upload, User, Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`dashboard-layout ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-primary">FinançasPro</h2>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">PRINCIPAL</p>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/" 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive('/') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <Home className="w-5 h-5 mr-2" />
                    <span className="font-bold">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/transactions" 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive('/transactions') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    <span className="font-bold">Lançamentos</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cards" 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive('/cards') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    <span className="font-bold">Cartões</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/accounts" 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive('/accounts') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <Landmark className="w-5 h-5 mr-2" />
                    <span className="font-bold">Contas</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">GERENCIAMENTO</p>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/categories" 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive('/categories') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <Tag className="w-5 h-5 mr-2" />
                    <span className="font-bold">Categorias</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/family" 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive('/family') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    <span className="font-bold">Família</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/import" 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive('/import') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    <span className="font-bold">Importar Dados</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">CONFIGURAÇÕES</p>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/profile" 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive('/profile') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <User className="w-5 h-5 mr-2" />
                    <span className="font-bold">Perfil</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/settings" 
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive('/settings') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    <span className="font-bold">Configurações</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {darkMode ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
              <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Karla</span>
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                    K
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
