import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ImportExcel from '../components/transactions/ImportExcel';

const ImportPage: React.FC = () => {
  const handleImportComplete = (data: any) => {
    console.log('Importação concluída:', data);
    // Aqui seria implementada a lógica para redirecionar ou atualizar dados
  };

  return (
    <DashboardLayout title="Importar Dados">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Importação de Dados</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <ImportExcel onImportComplete={handleImportComplete} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImportPage;
