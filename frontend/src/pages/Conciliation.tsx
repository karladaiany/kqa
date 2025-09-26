import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Conciliation from '../components/transactions/Conciliation';

const ConciliationPage: React.FC = () => {
  const handleConciliationComplete = (data: any) => {
    console.log('Conciliação concluída:', data);
    // Aqui seria implementada a lógica para atualizar o estado ou redirecionar
  };

  return (
    <DashboardLayout title="Conciliação">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Conciliação de Lançamentos</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <Conciliation onConciliationComplete={handleConciliationComplete} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConciliationPage;
