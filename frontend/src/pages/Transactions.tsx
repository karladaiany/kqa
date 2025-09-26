import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';

const TransactionsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddTransaction = (transaction: any) => {
    console.log('Nova transação:', transaction);
    // Aqui seria implementada a lógica para salvar a transação
    // Por enquanto, apenas fechamos o formulário
    setIsFormOpen(false);
  };

  return (
    <DashboardLayout title="Lançamentos">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lançamentos</h2>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Lançamento
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <TransactionList />
        </div>
      </div>

      <TransactionForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </DashboardLayout>
  );
};

export default TransactionsPage;
