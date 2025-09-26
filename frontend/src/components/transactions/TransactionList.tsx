import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { transactionService } from '../../services/api';

interface Transaction {
  id: number;
  description: string;
  category: string;
  date: string;
  amount: number;
  account: string;
  status: string;
}

interface TransactionListProps {
  transactions?: Transaction[];
  limit?: number;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions: initialTransactions, limit, onEdit, onDelete }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { 
      id: 1, 
      description: 'Supermercado Extra', 
      category: 'Alimentação', 
      date: '2025-06-10', 
      amount: -350.75, 
      account: 'Nubank',
      status: 'confirmed'
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
      account: 'Cartão Itaú',
      status: 'confirmed'
    },
    { 
      id: 5, 
      description: 'Uber', 
      category: 'Transporte', 
      date: '2025-06-14', 
      amount: -28.50, 
      account: 'Nubank',
      status: 'pending'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Se recebemos transações como prop, usamos elas
    if (initialTransactions && initialTransactions.length > 0) {
      setTransactions(initialTransactions);
      setLoading(false);
      return;
    }
    
    // Caso contrário, buscamos da API
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getAll();
        if (data && data.length > 0) {
          setTransactions(limit ? data.slice(0, limit) : data);
        }
      } catch (err) {
        console.error('Erro ao buscar transações:', err);
        setError('Não foi possível carregar as transações');
        // Mantém os dados simulados em caso de erro
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [initialTransactions, limit]);
  
  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Função para editar transação
  const handleEdit = (transaction: Transaction) => {
    if (onEdit) {
      onEdit(transaction);
    } else {
      console.log('Editar transação:', transaction);
      alert('Funcionalidade de edição será implementada em breve!');
    }
  };

  // Função para excluir transação
  const handleDelete = (transactionId: number) => {
    if (onDelete) {
      onDelete(transactionId);
    } else {
      if (confirm('Tem certeza que deseja excluir esta transação?')) {
        console.log('Excluir transação:', transactionId);
        alert('Funcionalidade de exclusão será implementada em breve!');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {[...Array(6)].map((_, index) => (
                  <th key={index} scope="col" className="px-6 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(6)].map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Transações Recentes</h3>
          <Link to="/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-4">
          <p>{error}</p>
          <p className="text-sm mt-2">Exibindo dados simulados.</p>
        </div>
        <div className="overflow-x-auto">
          {/* Tabela com dados simulados */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            {/* ... conteúdo da tabela ... */}
          </table>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Transações Recentes</h3>
        <Link to="/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Ver todas
        </Link>
      </div>
      
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
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
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
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  }`}>
                    {transaction.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button 
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
