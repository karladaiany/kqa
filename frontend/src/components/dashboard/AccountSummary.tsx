import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/api';

// Interfaces para tipagem
interface DashboardSummary {
  totalBalance: number;
  balanceChange: number;
  expenses: number;
  expenseChange: number;
  income: number;
  incomeChange: number;
  availableLimit: number;
  limitUsagePercentage: number;
}

interface AccountSummaryProps {
  accounts?: any[];
  cards?: any[];
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ accounts = [], cards = [] }) => {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalBalance: 5240.75,
    balanceChange: 12,
    expenses: 2150.30,
    expenseChange: 15,
    income: 7500.00,
    incomeChange: 0,
    availableLimit: 8320.45,
    limitUsagePercentage: 65
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getSummary();
        setSummary(data);
      } catch (err) {
        console.error('Erro ao buscar resumo do dashboard:', err);
        setError('Não foi possível carregar os dados do resumo');
        // Mantém os dados simulados em caso de erro
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, []);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-8">
        <p>{error}</p>
        <p className="text-sm mt-2">Exibindo dados simulados.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Saldo Total */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Total</h3>
          <div className="relative">
            <select 
              className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 pr-8 rounded-md text-xs"
              defaultValue="todos"
            >
              <option value="todos">Todos</option>
              <option value="bancos">Por Banco</option>
              <option value="carteira">Carteira</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalBalance)}
          </div>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${summary.balanceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {summary.balanceChange >= 0 ? '+' : ''}{summary.balanceChange}% em relação ao mês anterior
            </span>
          </div>
        </div>
      </div>

      {/* Despesas do Mês */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Despesas do Mês</h3>
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-red-500">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.expenses)}
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm font-medium text-red-500">
              +{summary.expenseChange}% em relação ao mês anterior
            </span>
          </div>
        </div>
      </div>

      {/* Receitas do Mês */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Receitas do Mês</h3>
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-green-500">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.income)}
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {summary.incomeChange === 0 
                ? 'Igual ao mês anterior' 
                : `${summary.incomeChange > 0 ? '+' : ''}${summary.incomeChange}% em relação ao mês anterior`}
            </span>
          </div>
        </div>
      </div>

      {/* Limite Disponível */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Limite Disponível</h3>
          <div className="relative">
            <select 
              className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 pr-8 rounded-md text-xs"
              defaultValue="todos"
            >
              <option value="todos">Todos</option>
              <option value="cartoes">Por Cartão</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.availableLimit)}
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-yellow-500 h-2.5 rounded-full" 
                style={{ width: `${summary.limitUsagePercentage}%` }}
              ></div>
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
              {summary.limitUsagePercentage}% utilizado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
