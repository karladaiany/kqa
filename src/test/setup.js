/**
 * Configuração global para testes unitários
 * Setup do Vitest + React Testing Library
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// Limpar após cada teste
afterEach(() => {
  cleanup();
});

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock da API de clipboard
const clipboardMock = {
  writeText: vi.fn().mockResolvedValue(undefined),
  readText: vi.fn().mockResolvedValue(''),
};

// Mock do window.matchMedia
const matchMediaMock = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock do IntersectionObserver
const intersectionObserverMock = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock do ResizeObserver
const resizeObserverMock = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock do fetch para testes de API
const fetchMock = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
  status: 200,
  statusText: 'OK',
});

// Mock do crypto.getRandomValues para testes de segurança
const cryptoMock = {
  getRandomValues: vi.fn().mockImplementation(array => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
  randomUUID: vi.fn().mockReturnValue('test-uuid-12345'),
};

// Mock do performance.now para testes de performance
const performanceMock = {
  now: vi.fn().mockReturnValue(1000),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn().mockReturnValue([]),
  memory: {
    usedJSHeapSize: 1024 * 1024, // 1MB
    totalJSHeapSize: 2 * 1024 * 1024, // 2MB
    jsHeapSizeLimit: 4 * 1024 * 1024, // 4MB
  },
};

beforeEach(() => {
  // Configurar mocks globais
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });

  Object.defineProperty(navigator, 'clipboard', {
    value: clipboardMock,
    configurable: true,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: intersectionObserverMock,
  });

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: resizeObserverMock,
  });

  Object.defineProperty(global, 'fetch', {
    writable: true,
    value: fetchMock,
  });

  Object.defineProperty(window, 'crypto', {
    writable: true,
    value: cryptoMock,
  });

  Object.defineProperty(global, 'crypto', {
    writable: true,
    value: cryptoMock,
  });

  Object.defineProperty(global, 'performance', {
    writable: true,
    value: performanceMock,
  });

  // Mock do console para testes mais limpos
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  vi.spyOn(console, 'debug').mockImplementation(() => {});

  // Mock de timers para testes de debounce/throttle
  vi.useFakeTimers();

  // Limpar todos os mocks antes de cada teste
  vi.clearAllMocks();
});

afterEach(() => {
  // Restaurar timers reais
  vi.useRealTimers();
});

// Configurações globais para testes
global.ResizeObserver = resizeObserverMock;
global.IntersectionObserver = intersectionObserverMock;

// Helper para testes de performance
global.measurePerformance = async (fn, maxTime = 100) => {
  const start = Date.now();
  await fn();
  const end = Date.now();
  const duration = end - start;

  if (duration > maxTime) {
    console.warn(
      `Performance warning: Function took ${duration}ms (max: ${maxTime}ms)`
    );
  }

  return duration;
};

// Helper para testes de memória
global.measureMemory = () => {
  if (performance.memory) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      percentage:
        (performance.memory.usedJSHeapSize /
          performance.memory.totalJSHeapSize) *
        100,
    };
  }
  return null;
};

// Helper para simular interações do usuário
global.simulateUserDelay = async (ms = 100) => {
  await new Promise(resolve => setTimeout(resolve, ms));
};

// Mock de dados para testes consistentes
global.mockData = {
  person: {
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    cpf: '11144477735',
    rg: '123456789',
  },
  company: {
    nome: 'Empresa Teste LTDA',
    cnpj: '11222333000181',
    telefone: '(11) 3333-4444',
  },
  card: {
    numero: '4111111111111111',
    nome: 'JOÃO SILVA',
    validade: '12/28',
    cvv: '123',
  },
  address: {
    rua: 'Rua das Flores',
    numero: '123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234567',
  },
};

// Configurações específicas do Vitest
if (typeof vi !== 'undefined') {
  // Configurar timeout padrão para testes assíncronos
  vi.setConfig({
    testTimeout: 5000,
    hookTimeout: 10000,
  });
}
