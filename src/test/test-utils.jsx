/**
 * Utilitários para testes unitários
 * Wrappers e helpers para React Testing Library
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import { vi } from 'vitest';

// Provider personalizado para testes
const TestProvider = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

// Função customizada de render que inclui providers
const customRender = (ui, options = {}) => {
  const { wrapper: Wrapper = TestProvider, ...renderOptions } = options;

  const AllTheProviders = ({ children }) => {
    return <Wrapper>{children}</Wrapper>;
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// Helpers para testes
export const createMockEvent = (type = 'click', properties = {}) => ({
  type,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: { value: '' },
  ...properties,
});

export const createMockChangeEvent = (value = '') => ({
  target: { value },
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
});

export const waitForElement = async (getByTestId, testId, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkElement = () => {
      try {
        const element = getByTestId(testId);
        if (element) {
          resolve(element);
          return;
        }
      } catch (error) {
        // Elemento ainda não encontrado
      }

      if (Date.now() - startTime > timeout) {
        reject(
          new Error(
            `Elemento com testId "${testId}" não encontrado após ${timeout}ms`
          )
        );
        return;
      }

      setTimeout(checkElement, 50);
    };

    checkElement();
  });
};

// Mock de dados para testes
export const mockPersonData = {
  nome: 'João Silva',
  email: 'joao.silva@email.com',
  telefone: '(11) 99999-9999',
  endereco: {
    rua: 'Rua das Flores, 123',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
  },
};

export const mockDocuments = {
  cpf: {
    formatted: '123.456.789-01',
    raw: '12345678901',
  },
  cnpj: {
    formatted: '12.345.678/0001-90',
    raw: '12345678000190',
  },
  rg: {
    formatted: '12.345.678-9',
    raw: '123456789',
  },
};

export const mockCard = {
  numero: '4111111111111111',
  numeroFormatado: '4111 1111 1111 1111',
  nome: 'JOÃO SILVA',
  validade: '12/28',
  cvv: '123',
};

export const mockProduct = {
  nome: 'Smartphone XYZ',
  descricao: 'Smartphone com tela de 6.5 polegadas',
  categorias: ['Eletrônicos', 'Smartphones'],
};

// Re-exportar tudo do testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Exportar render customizado como padrão
export { customRender as render };
