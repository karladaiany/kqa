import React from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import AccountSummary from '../components/dashboard/AccountSummary';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import MonthlyComparison from '../components/dashboard/MonthlyComparison';
import TransactionList from '../components/transactions/TransactionList';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Visão Geral Financeira</h2>
        
        {/* Cards de resumo */}
        <AccountSummary />
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExpenseChart />
          <MonthlyComparison />
        </div>
        
        {/* Lista de transações */}
        <TransactionList />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
