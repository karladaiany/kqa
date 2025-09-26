import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/api';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface MonthlyComparisonProps {
  monthlyData?: any[];
}

const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({ monthlyData = [] }) => {
  const [data, setData] = useState<MonthlyData[]>([
    { month: 'Jan', income: 7500, expenses: 2200 },
    { month: 'Fev', income: 7500, expenses: 2000 },
    { month: 'Mar', income: 7500, expenses: 1950 },
    { month: 'Abr', income: 7500, expenses: 1900 },
    { month: 'Mai', income: 7500, expenses: 2150 }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Encontrar o valor máximo para escala do gráfico
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.income, item.expenses))
  );
  
  // Altura do gráfico
  const chartHeight = 200;
  
  useEffect(() => {
    const fetchMonthlyComparison = async () => {
      try {
        setLoading(true);
        const responseData = await dashboardService.getMonthlyComparison();
        if (responseData && responseData.length > 0) {
          setData(responseData);
        }
      } catch (err) {
        console.error('Erro ao buscar comparação mensal:', err);
        setError('Não foi possível carregar os dados de comparação mensal');
        // Mantém os dados simulados em caso de erro
      } finally {
        setLoading(false);
      }
    };
    
    fetchMonthlyComparison();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="flex items-center justify-center mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mr-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="relative h-64">
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            ))}
          </div>
          <div className="ml-16 h-full flex items-end">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="flex space-x-2 h-48 items-end mb-2">
                  <div className="w-8 bg-gray-200 dark:bg-gray-700 rounded-t h-32"></div>
                  <div className="w-8 bg-gray-200 dark:bg-gray-700 rounded-t h-16"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Receitas vs Despesas</h3>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
          <p>{error}</p>
          <p className="text-sm mt-2">Exibindo dados simulados.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Receitas vs Despesas</h3>
      
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
          <span className="text-xs text-gray-700 dark:text-gray-300">Receitas</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
          <span className="text-xs text-gray-700 dark:text-gray-300">Despesas</span>
        </div>
      </div>
      
      <div className="relative h-64">
        {/* Eixo Y - Valores */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-2">
          <div>R$ 8000</div>
          <div>R$ 7000</div>
          <div>R$ 6000</div>
          <div>R$ 5000</div>
          <div>R$ 4000</div>
          <div>R$ 3000</div>
          <div>R$ 2000</div>
          <div>R$ 1000</div>
          <div>R$ 0</div>
        </div>
        
        {/* Gráfico de barras */}
        <div className="ml-12 h-full flex items-end">
          <div className="flex-1 flex items-end justify-around h-full relative">
            {/* Linhas de grade horizontais */}
            <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-between">
              {[...Array(9)].map((_, i) => (
                <div 
                  key={i} 
                  className="border-t border-gray-200 dark:border-gray-700 w-full"
                  style={{ height: i === 8 ? '1px' : 'auto' }}
                ></div>
              ))}
            </div>
            
            {/* Barras do gráfico */}
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center mx-2 z-10">
                <div className="flex space-x-2 h-48 items-end mb-2">
                  {/* Barra de receitas */}
                  <div 
                    className="w-8 bg-green-500 rounded-t"
                    style={{ 
                      height: `${(item.income / maxValue) * chartHeight}px`
                    }}
                  ></div>
                  
                  {/* Barra de despesas */}
                  <div 
                    className="w-8 bg-red-500 rounded-t"
                    style={{ 
                      height: `${(item.expenses / maxValue) * chartHeight}px`
                    }}
                  ></div>
                </div>
                
                {/* Rótulo do mês */}
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {item.month}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyComparison;
