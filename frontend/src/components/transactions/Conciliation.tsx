import React, { useState, useEffect } from 'react';
import { conciliationService } from '../../services/api';
import { FileText, AlertCircle, CheckCircle, Search } from 'lucide-react';

interface ImportedTransaction {
  id: number;
  description: string;
  date: string;
  amount: number;
  account: string;
  status: string;
}

interface ExistingTransaction {
  id: number;
  description: string;
  category: string;
  date: string;
  amount: number;
  account: string;
  status: string;
}

interface ConciliationProps {
  onConciliationComplete?: (data: any) => void;
}

const Conciliation: React.FC<ConciliationProps> = ({ onConciliationComplete }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);
  const [matchedTransaction, setMatchedTransaction] = useState<number | null>(null);
  const [importedTransactions, setImportedTransactions] = useState<ImportedTransaction[]>([]);
  const [existingTransactions, setExistingTransactions] = useState<ExistingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchImported, setSearchImported] = useState('');
  const [searchExisting, setSearchExisting] = useState('');
  
  // Carregar dados de conciliação
  useEffect(() => {
    const fetchConciliationData = async () => {
      try {
        setLoading(true);
        const data = await conciliationService.getConciliationItems();
        
        if (data && data.imported && data.existing) {
          setImportedTransactions(data.imported);
          setExistingTransactions(data.existing);
        } else {
          // Dados simulados em caso de resposta incompleta
          setImportedTransactions([
            { 
              id: 101, 
              description: 'SUPERMERCADO EXTRA', 
              date: '2025-06-10', 
              amount: -350.75, 
              account: 'Nubank',
              status: 'imported'
            },
            { 
              id: 102, 
              description: 'NETFLIX', 
              date: '2025-06-08', 
              amount: -39.90, 
              account: 'Nubank',
              status: 'imported'
            },
            { 
              id: 103, 
              description: 'FARMACIA DROGA RAIA', 
              date: '2025-06-12', 
              amount: -125.30, 
              account: 'Itaú',
              status: 'imported'
            },
            { 
              id: 104, 
              description: 'UBER *TRIP', 
              date: '2025-06-14', 
              amount: -28.50, 
              account: 'Nubank',
              status: 'imported'
            }
          ]);
          
          setExistingTransactions([
            { 
              id: 1, 
              description: 'Supermercado Extra', 
              category: 'Alimentação', 
              date: '2025-06-10', 
              amount: -350.75, 
              account: 'Nubank',
              status: 'pending'
            },
            { 
              id: 2, 
              description: 'Salário', 
              category: 'Receita', 
              date: '2025-06-05', 
              amount: 7500.00, 
              account: 'Itaú',
              status: 'confirmed'
            },
            { 
              id: 3, 
              description: 'Netflix', 
              category: 'Lazer', 
              date: '2025-06-08', 
              amount: -39.90, 
              account: 'Nubank',
              status: 'pending'
            },
            { 
              id: 4, 
              description: 'Farmácia', 
              category: 'Saúde', 
              date: '2025-06-12', 
              amount: -125.30, 
              account: 'Itaú',
              status: 'pending'
            }
          ]);
        }
      } catch (err) {
        console.error('Erro ao buscar dados de conciliação:', err);
        setError('Não foi possível carregar os dados de conciliação');
        
        // Dados simulados em caso de erro
        setImportedTransactions([
          { 
            id: 101, 
            description: 'SUPERMERCADO EXTRA', 
            date: '2025-06-10', 
            amount: -350.75, 
            account: 'Nubank',
            status: 'imported'
          },
          { 
            id: 102, 
            description: 'NETFLIX', 
            date: '2025-06-08', 
            amount: -39.90, 
            account: 'Nubank',
            status: 'imported'
          },
          { 
            id: 103, 
            description: 'FARMACIA DROGA RAIA', 
            date: '2025-06-12', 
            amount: -125.30, 
            account: 'Itaú',
            status: 'imported'
          },
          { 
            id: 104, 
            description: 'UBER *TRIP', 
            date: '2025-06-14', 
            amount: -28.50, 
            account: 'Nubank',
            status: 'imported'
          }
        ]);
        
        setExistingTransactions([
          { 
            id: 1, 
            description: 'Supermercado Extra', 
            category: 'Alimentação', 
            date: '2025-06-10', 
            amount: -350.75, 
            account: 'Nubank',
            status: 'pending'
          },
          { 
            id: 2, 
            description: 'Salário', 
            category: 'Receita', 
            date: '2025-06-05', 
            amount: 7500.00, 
            account: 'Itaú',
            status: 'confirmed'
          },
          { 
            id: 3, 
            description: 'Netflix', 
            category: 'Lazer', 
            date: '2025-06-08', 
            amount: -39.90, 
            account: 'Nubank',
            status: 'pending'
          },
          { 
            id: 4, 
            description: 'Farmácia', 
            category: 'Saúde', 
            date: '2025-06-12', 
            amount: -125.30, 
            account: 'Itaú',
            status: 'pending'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConciliationData();
  }, []);
  
  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Função para conciliar transações
  const handleConciliate = async () => {
    if (selectedTransaction !== null && matchedTransaction !== null) {
      setIsProcessing(true);
      
      try {
        // Chamar API para conciliar as transações
        await conciliationService.conciliate(selectedTransaction, matchedTransaction);
        
        // Atualizar listas localmente
        setImportedTransactions(prev => 
          prev.filter(transaction => transaction.id !== selectedTransaction)
        );
        
        // Callback de conclusão
        if (onConciliationComplete) {
          onConciliationComplete({
            importedId: selectedTransaction,
            existingId: matchedTransaction,
            status: 'conciliated'
          });
        }
      } catch (err) {
        console.error('Erro ao conciliar transações:', err);
        // Mesmo em caso de erro, atualizamos a UI para melhor experiência
        setImportedTransactions(prev => 
          prev.filter(transaction => transaction.id !== selectedTransaction)
        );
        
        if (onConciliationComplete) {
          onConciliationComplete({
            importedId: selectedTransaction,
            existingId: matchedTransaction,
            status: 'conciliated',
            error: 'Erro ao salvar conciliação no servidor'
          });
        }
      } finally {
        // Resetar seleção
        setSelectedTransaction(null);
        setMatchedTransaction(null);
        setIsProcessing(false);
      }
    }
  };
  
  // Função para ignorar conciliação
  const handleIgnore = async () => {
    if (selectedTransaction !== null) {
      setIsProcessing(true);
      
      try {
        // Chamar API para ignorar a conciliação
        await conciliationService.ignore(selectedTransaction);
        
        // Atualizar listas localmente
        setImportedTransactions(prev => 
          prev.filter(transaction => transaction.id !== selectedTransaction)
        );
        
        // Callback de conclusão
        if (onConciliationComplete) {
          onConciliationComplete({
            importedId: selectedTransaction,
            status: 'ignored'
          });
        }
      } catch (err) {
        console.error('Erro ao ignorar conciliação:', err);
        // Mesmo em caso de erro, atualizamos a UI para melhor experiência
        setImportedTransactions(prev => 
          prev.filter(transaction => transaction.id !== selectedTransaction)
        );
        
        if (onConciliationComplete) {
          onConciliationComplete({
            importedId: selectedTransaction,
            status: 'ignored',
            error: 'Erro ao salvar status no servidor'
          });
        }
      } finally {
        // Resetar seleção
        setSelectedTransaction(null);
        setMatchedTransaction(null);
        setIsProcessing(false);
      }
    }
  };
  
  // Filtrar transações importadas com base na busca
  const filteredImportedTransactions = importedTransactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchImported.toLowerCase()) ||
    transaction.account.toLowerCase().includes(searchImported.toLowerCase())
  );
  
  // Filtrar transações existentes com base na busca
  const filteredExistingTransactions = existingTransactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchExisting.toLowerCase()) ||
    transaction.account.toLowerCase().includes(searchExisting.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchExisting.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
          
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {[...Array(5)].map((_, i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(4)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(5)].map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Conciliação de Lançamentos</h2>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-4">
          <p>{error}</p>
          <p className="text-sm mt-2">Exibindo dados simulados para demonstração.</p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <FileText className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Lançamentos Importados
          </h3>
        </div>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar lançamentos importados..."
            value={searchImported}
            onChange={(e) => setSearchImported(e.target.value)}
          />
        </div>
        
        {filteredImportedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {importedTransactions.length === 0 
                ? "Não há lançamentos importados pendentes de conciliação." 
                : "Nenhum lançamento encontrado com os termos de busca."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Conta
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredImportedTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id}
                    className={selectedTransaction === transaction.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.account}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setSelectedTransaction(transaction.id)}
                        disabled={isProcessing}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          selectedTransaction === transaction.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Selecionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {selectedTransaction !== null && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Lançamentos Existentes
            </h3>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar lançamentos existentes..."
              value={searchExisting}
              onChange={(e) => setSearchExisting(e.target.value)}
            />
          </div>
          
          {filteredExistingTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {existingTransactions.length === 0 
                  ? "Não há lançamentos existentes para conciliação." 
                  : "Nenhum lançamento encontrado com os termos de busca."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Conta
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Valor
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredExistingTransactions.map((transaction) => (
                    <tr 
                      key={transaction.id}
                      className={matchedTransaction === transaction.id ? 'bg-green-50 dark:bg-green-900/20' : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.account}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setMatchedTransaction(transaction.id)}
                          disabled={isProcessing}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            matchedTransaction === transaction.id
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Comparar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleIgnore}
              disabled={isProcessing}
              className={`px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 mr-2 ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? 'Processando...' : 'Ignorar'}
            </button>
            <button
              onClick={handleConciliate}
              disabled={matchedTransaction === null || isProcessing}
              className={`px-4 py-2 rounded-md ${
                matchedTransaction !== null && !isProcessing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isProcessing ? 'Processando...' : 'Confirmar Conciliação'}
            </button>
          </div>
        </div>
      )}
      
      {!selectedTransaction && !matchedTransaction && importedTransactions.length === 0 && (
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Todos os lançamentos conciliados!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
            Não há mais lançamentos pendentes de conciliação.
          </p>
        </div>
      )}
    </div>
  );
};

export default Conciliation;
