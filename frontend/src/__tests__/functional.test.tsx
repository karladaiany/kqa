import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import ImportPage from '../pages/Import';
import ConciliationPage from '../pages/Conciliation';
import Login from '../pages/Login';

// Mock dos serviços de API
jest.mock('../services/api', () => ({
  dashboardService: {
    getSummary: jest.fn().mockResolvedValue({
      totalBalance: 5240.75,
      balanceChange: 12,
      expenses: 2150.30,
      expenseChange: 15,
      income: 7500.00,
      incomeChange: 0,
      availableLimit: 8320.45,
      limitUsagePercentage: 65
    }),
    getExpensesByCategory: jest.fn().mockResolvedValue([
      { id: 1, name: 'Moradia', color: '#a78bfa', value: 1800.00 },
      { id: 2, name: 'Alimentação', color: '#f472b6', value: 1250.75 },
      { id: 3, name: 'Transporte', color: '#4ade80', value: 450.30 }
    ]),
    getMonthlyComparison: jest.fn().mockResolvedValue([
      { month: 'Jan', income: 7500, expenses: 2200 },
      { month: 'Fev', income: 7500, expenses: 2000 },
      { month: 'Mar', income: 7500, expenses: 1950 }
    ])
  },
  transactionService: {
    getAll: jest.fn().mockResolvedValue([
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
      }
    ])
  },
  importService: {
    importExcel: jest.fn().mockResolvedValue({
      columns: [
        { source: 'Data', target: 'date', status: 'mapped' },
        { source: 'Descrição', target: 'description', status: 'mapped' },
        { source: 'Valor', target: 'amount', status: 'mapped' }
      ],
      totalRows: 50,
      importedRows: 47,
      errors: [
        { row: 5, message: 'Formato de data inválido' },
        { row: 12, message: 'Valor não numérico' },
        { row: 23, message: 'Categoria não reconhecida' }
      ]
    })
  },
  conciliationService: {
    getConciliationItems: jest.fn().mockResolvedValue({
      imported: [
        { 
          id: 101, 
          description: 'SUPERMERCADO EXTRA', 
          date: '2025-06-10', 
          amount: -350.75, 
          account: 'Nubank',
          status: 'imported'
        }
      ],
      existing: [
        { 
          id: 1, 
          description: 'Supermercado Extra', 
          category: 'Alimentação', 
          date: '2025-06-10', 
          amount: -350.75, 
          account: 'Nubank',
          status: 'pending'
        }
      ]
    }),
    conciliate: jest.fn().mockResolvedValue({ success: true }),
    ignore: jest.fn().mockResolvedValue({ success: true })
  },
  authService: {
    login: jest.fn().mockImplementation((email, password) => {
      if (email === 'teste@exemplo.com' && password === 'senha123') {
        return Promise.resolve({ 
          token: 'fake-jwt-token',
          user: { id: 1, name: 'Usuário Teste', email: 'teste@exemplo.com' }
        });
      }
      return Promise.reject(new Error('Credenciais inválidas'));
    })
  }
}));

// Componente wrapper para testes
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Testes Funcionais da Aplicação', () => {
  beforeEach(() => {
    // Limpar mocks entre testes
    jest.clearAllMocks();
    
    // Simular localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });
  
  describe('Login', () => {
    test('deve exibir erro com credenciais inválidas', async () => {
      render(<TestWrapper><Login /></TestWrapper>);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalido@exemplo.com' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senhaerrada' } });
      fireEvent.click(screen.getByText(/entrar/i));
      
      await waitFor(() => {
        expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
      });
    });
    
    test('deve fazer login com credenciais válidas', async () => {
      const mockNavigate = jest.fn();
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate
      }));
      
      render(<TestWrapper><Login /></TestWrapper>);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'teste@exemplo.com' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha123' } });
      fireEvent.click(screen.getByText(/entrar/i));
      
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', expect.any(String));
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });
  
  describe('Dashboard', () => {
    test('deve carregar e exibir dados do dashboard', async () => {
      render(<TestWrapper><Dashboard /></TestWrapper>);
      
      await waitFor(() => {
        // Verificar se os componentes principais estão presentes
        expect(screen.getByText(/visão geral financeira/i)).toBeInTheDocument();
        expect(screen.getByText(/saldo total/i)).toBeInTheDocument();
        expect(screen.getByText(/despesas do mês/i)).toBeInTheDocument();
        expect(screen.getByText(/receitas do mês/i)).toBeInTheDocument();
        
        // Verificar se os dados foram carregados
        expect(screen.getByText(/r\$ 5\.240,75/i)).toBeInTheDocument();
        expect(screen.getByText(/r\$ 2\.150,30/i)).toBeInTheDocument();
        expect(screen.getByText(/r\$ 7\.500,00/i)).toBeInTheDocument();
      });
      
      // Verificar se os serviços foram chamados
      expect(dashboardService.getSummary).toHaveBeenCalled();
      expect(dashboardService.getExpensesByCategory).toHaveBeenCalled();
      expect(dashboardService.getMonthlyComparison).toHaveBeenCalled();
      expect(transactionService.getAll).toHaveBeenCalled();
    });
  });
  
  describe('Importação', () => {
    test('deve permitir importação de arquivo Excel', async () => {
      render(<TestWrapper><ImportPage /></TestWrapper>);
      
      // Verificar se o componente de importação está presente
      expect(screen.getByText(/importar planilha excel/i)).toBeInTheDocument();
      
      // Simular upload de arquivo
      const file = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileInput = screen.getByLabelText(/selecionar arquivo/i);
      
      Object.defineProperty(fileInput, 'files', {
        value: [file]
      });
      
      fireEvent.change(fileInput);
      
      // Avançar para etapa de mapeamento
      await waitFor(() => {
        expect(screen.getByText(/mapear colunas/i)).toBeInTheDocument();
      });
      
      // Verificar se o mapeamento automático foi aplicado
      expect(screen.getByText(/data/i)).toBeInTheDocument();
      expect(screen.getByText(/descrição/i)).toBeInTheDocument();
      expect(screen.getByText(/valor/i)).toBeInTheDocument();
      
      // Continuar para importação
      fireEvent.click(screen.getByText(/continuar/i));
      
      // Verificar se erros são exibidos
      await waitFor(() => {
        expect(screen.getByText(/encontramos alguns problemas/i)).toBeInTheDocument();
        expect(screen.getByText(/formato de data inválido/i)).toBeInTheDocument();
      });
      
      // Ignorar erros e finalizar
      fireEvent.click(screen.getByText(/ignorar erros e importar/i));
      
      // Verificar se a importação foi concluída
      await waitFor(() => {
        expect(importService.importExcel).toHaveBeenCalled();
      });
    });
  });
  
  describe('Conciliação', () => {
    test('deve permitir conciliar transações', async () => {
      render(<TestWrapper><ConciliationPage /></TestWrapper>);
      
      // Verificar se o componente de conciliação está presente
      await waitFor(() => {
        expect(screen.getByText(/conciliação de lançamentos/i)).toBeInTheDocument();
        expect(screen.getByText(/lançamentos importados/i)).toBeInTheDocument();
      });
      
      // Verificar se os dados foram carregados
      expect(screen.getByText(/supermercado extra/i)).toBeInTheDocument();
      
      // Selecionar transação importada
      fireEvent.click(screen.getByText(/selecionar/i));
      
      // Verificar se a lista de transações existentes aparece
      await waitFor(() => {
        expect(screen.getByText(/lançamentos existentes/i)).toBeInTheDocument();
      });
      
      // Selecionar transação existente para conciliar
      fireEvent.click(screen.getByText(/comparar/i));
      
      // Confirmar conciliação
      fireEvent.click(screen.getByText(/confirmar conciliação/i));
      
      // Verificar se a conciliação foi realizada
      await waitFor(() => {
        expect(conciliationService.conciliate).toHaveBeenCalledWith(101, 1);
      });
    });
  });
});
