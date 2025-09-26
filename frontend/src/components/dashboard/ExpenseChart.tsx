import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/api';

interface ExpenseCategory {
  id: number;
  name: string;
  color: string;
  value: number;
}

interface ExpenseChartProps {
  expenses?: any[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses = [] }) => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    { id: 1, name: 'Moradia', color: '#a78bfa', value: 1800.00 },
    { id: 2, name: 'Alimentação', color: '#f472b6', value: 1250.75 },
    { id: 3, name: 'Transporte', color: '#4ade80', value: 450.30 },
    { id: 4, name: 'Saúde', color: '#38bdf8', value: 520.00 },
    { id: 5, name: 'Lazer', color: '#fb923c', value: 380.45 },
    { id: 6, name: 'Educação', color: '#f87171', value: 250.50 },
    { id: 7, name: 'Outros', color: '#c084fc', value: 150.00 }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Calcular o total
  const total = categories.reduce((sum, category) => sum + category.value, 0);
  
  useEffect(() => {
    const fetchExpensesByCategory = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getExpensesByCategory();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Erro ao buscar despesas por categoria:', err);
        setError('Não foi possível carregar os dados de despesas por categoria');
        // Mantém os dados simulados em caso de erro
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpensesByCategory();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
            <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="space-y-3">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1 flex justify-between items-center">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Despesas por Categoria</h3>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
          <p>{error}</p>
          <p className="text-sm mt-2">Exibindo dados simulados.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Despesas por Categoria</h3>
      
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
          {/* Representação visual do gráfico de pizza */}
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="20" />
              
              {/* Segmentos do gráfico - gerados dinamicamente */}
              {categories.map((category, index) => {
                // Calcular o offset baseado nas categorias anteriores
                const previousCategories = categories.slice(0, index);
                const previousTotal = previousCategories.reduce((sum, cat) => sum + cat.value, 0);
                const offset = (previousTotal / total) * 251.2;
                
                return (
                  <circle 
                    key={category.id}
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke={category.color} 
                    strokeWidth="20" 
                    strokeDasharray={`${(category.value / total) * 251.2} 251.2`} 
                    strokeDashoffset={`${-offset}`}
                    transform="rotate(-90 50 50)"
                  />
                );
              })}
              
              {/* Círculo central */}
              <circle cx="50" cy="50" r="30" fill="white" className="dark:fill-gray-800" />
            </svg>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <ul className="space-y-3">
            {categories.map(category => (
              <li key={category.id} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-2" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(category.value)}
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right">
                      {Math.round((category.value / total) * 100)}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
