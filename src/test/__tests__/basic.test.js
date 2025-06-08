/**
 * Testes básicos para verificar se o ambiente está funcionando
 */

import { describe, it, expect, vi } from 'vitest';

describe('Ambiente de Testes', () => {
  it('deve executar testes básicos', () => {
    expect(1 + 1).toBe(2);
  });

  it('deve ter acesso às funções do Vitest', () => {
    expect(typeof describe).toBe('function');
    expect(typeof it).toBe('function');
    expect(typeof expect).toBe('function');
  });

  it('deve trabalhar com arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('deve trabalhar com objetos', () => {
    const obj = { name: 'João', age: 30 };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('João');
  });

  it('deve trabalhar com strings', () => {
    const str = 'Hello World';
    expect(str).toContain('World');
    expect(str).toMatch(/Hello/);
  });

  it('deve trabalhar com promises', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBe('success');
  });

  it('deve trabalhar com funções mock', () => {
    const mockFn = vi.fn();
    mockFn('test');

    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
