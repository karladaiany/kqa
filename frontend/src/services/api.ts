import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erro de autenticação
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de API
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },
};

export const transactionService = {
  getAll: async () => {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar transação ${id}:`, error);
      throw error;
    }
  },
  create: async (transactionData: any) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  },
  update: async (id: number, transactionData: any) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar transação ${id}:`, error);
      throw error;
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir transação ${id}:`, error);
      throw error;
    }
  },
};

export const importService = {
  importExcel: async (formData: FormData) => {
    try {
      const response = await api.post('/import/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao importar Excel:', error);
      throw error;
    }
  },
  importPdf: async (formData: FormData) => {
    try {
      const response = await api.post('/import/pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao importar PDF:', error);
      throw error;
    }
  },
};

export const conciliationService = {
  getConciliationItems: async () => {
    try {
      const response = await api.get('/conciliation/items');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar itens de conciliação:', error);
      throw error;
    }
  },
  conciliate: async (importedId: number, existingId: number) => {
    try {
      const response = await api.post('/conciliation/match', { importedId, existingId });
      return response.data;
    } catch (error) {
      console.error('Erro ao conciliar transações:', error);
      throw error;
    }
  },
  ignore: async (importedId: number) => {
    try {
      const response = await api.post('/conciliation/ignore', { importedId });
      return response.data;
    } catch (error) {
      console.error('Erro ao ignorar conciliação:', error);
      throw error;
    }
  },
};

export const dashboardService = {
  getSummary: async () => {
    try {
      const response = await api.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar resumo do dashboard:', error);
      throw error;
    }
  },
  getExpensesByCategory: async () => {
    try {
      const response = await api.get('/dashboard/expenses-by-category');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar despesas por categoria:', error);
      throw error;
    }
  },
  getMonthlyComparison: async () => {
    try {
      const response = await api.get('/dashboard/monthly-comparison');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar comparação mensal:', error);
      throw error;
    }
  },
};

export default api;
