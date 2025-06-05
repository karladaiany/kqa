/**
 * Testes unitários para geradores de documentos
 */

import { describe, it, expect } from 'vitest';
import {
  generateCPF,
  generateCNPJ,
  generateRG,
  formatCPF,
  formatCNPJ,
  formatRG,
  validateCPF,
  validateCNPJ,
} from '../documents';

describe('Geradores de Documentos', () => {
  describe('generateCPF', () => {
    it('deve gerar CPF com 11 dígitos', () => {
      const cpf = generateCPF();
      expect(cpf).toHaveLength(11);
      expect(/^\d{11}$/.test(cpf)).toBe(true);
    });

    it('deve gerar CPFs diferentes em chamadas consecutivas', () => {
      const cpf1 = generateCPF();
      const cpf2 = generateCPF();
      expect(cpf1).not.toBe(cpf2);
    });

    it('deve gerar CPF válido', () => {
      const cpf = generateCPF();
      expect(validateCPF(cpf)).toBe(true);
    });

    it('deve gerar múltiplos CPFs válidos', () => {
      for (let i = 0; i < 10; i++) {
        const cpf = generateCPF();
        expect(validateCPF(cpf)).toBe(true);
      }
    });
  });

  describe('generateCNPJ', () => {
    it('deve gerar CNPJ com 14 dígitos', () => {
      const cnpj = generateCNPJ();
      expect(cnpj).toHaveLength(14);
      expect(/^\d{14}$/.test(cnpj)).toBe(true);
    });

    it('deve gerar CNPJs diferentes em chamadas consecutivas', () => {
      const cnpj1 = generateCNPJ();
      const cnpj2 = generateCNPJ();
      expect(cnpj1).not.toBe(cnpj2);
    });

    it('deve gerar CNPJ válido', () => {
      const cnpj = generateCNPJ();
      expect(validateCNPJ(cnpj)).toBe(true);
    });

    it('deve gerar múltiplos CNPJs válidos', () => {
      for (let i = 0; i < 10; i++) {
        const cnpj = generateCNPJ();
        expect(validateCNPJ(cnpj)).toBe(true);
      }
    });
  });

  describe('generateRG', () => {
    it('deve gerar RG com formato correto', () => {
      const rg = generateRG();
      expect(rg).toHaveLength(9);
      expect(/^\d{8}[0-9X]$/.test(rg)).toBe(true);
    });

    it('deve gerar RGs diferentes em chamadas consecutivas', () => {
      const rg1 = generateRG();
      const rg2 = generateRG();
      expect(rg1).not.toBe(rg2);
    });
  });

  describe('formatCPF', () => {
    it('deve formatar CPF corretamente', () => {
      const formatted = formatCPF('12345678901');
      expect(formatted).toBe('123.456.789-01');
    });

    it('deve lidar com CPF já formatado', () => {
      const formatted = formatCPF('123.456.789-01');
      expect(formatted).toBe('123.456.789-01');
    });

    it('deve lidar com string vazia', () => {
      const formatted = formatCPF('');
      expect(formatted).toBe('');
    });

    it('deve lidar com null/undefined', () => {
      expect(formatCPF(null)).toBe('');
      expect(formatCPF(undefined)).toBe('');
    });
  });

  describe('formatCNPJ', () => {
    it('deve formatar CNPJ corretamente', () => {
      const formatted = formatCNPJ('12345678000190');
      expect(formatted).toBe('12.345.678/0001-90');
    });

    it('deve lidar com CNPJ já formatado', () => {
      const formatted = formatCNPJ('12.345.678/0001-90');
      expect(formatted).toBe('12.345.678/0001-90');
    });

    it('deve lidar com string vazia', () => {
      const formatted = formatCNPJ('');
      expect(formatted).toBe('');
    });

    it('deve lidar com null/undefined', () => {
      expect(formatCNPJ(null)).toBe('');
      expect(formatCNPJ(undefined)).toBe('');
    });
  });

  describe('formatRG', () => {
    it('deve formatar RG corretamente', () => {
      const formatted = formatRG('123456789');
      expect(formatted).toBe('12.345.678-9');
    });

    it('deve lidar com RG já formatado', () => {
      const formatted = formatRG('12.345.678-9');
      expect(formatted).toBe('12.345.678-9');
    });

    it('deve lidar com string vazia', () => {
      const formatted = formatRG('');
      expect(formatted).toBe('');
    });
  });

  describe('validateCPF', () => {
    it('deve validar CPF correto', () => {
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('deve invalidar CPF com dígitos verificadores incorretos', () => {
      expect(validateCPF('11144477734')).toBe(false);
    });

    it('deve invalidar CPF com todos os dígitos iguais', () => {
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('00000000000')).toBe(false);
    });

    it('deve invalidar CPF com tamanho incorreto', () => {
      expect(validateCPF('123456789')).toBe(false);
      expect(validateCPF('123456789012')).toBe(false);
    });

    it('deve invalidar CPF com caracteres não numéricos', () => {
      expect(validateCPF('1234567890a')).toBe(false);
    });

    it('deve lidar com CPF formatado', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
    });
  });

  describe('validateCNPJ', () => {
    it('deve validar CNPJ correto', () => {
      expect(validateCNPJ('11222333000181')).toBe(true);
    });

    it('deve invalidar CNPJ com dígitos verificadores incorretos', () => {
      expect(validateCNPJ('11222333000180')).toBe(false);
    });

    it('deve invalidar CNPJ com todos os dígitos iguais', () => {
      expect(validateCNPJ('11111111111111')).toBe(false);
    });

    it('deve invalidar CNPJ com tamanho incorreto', () => {
      expect(validateCNPJ('1122233300018')).toBe(false);
      expect(validateCNPJ('112223330001811')).toBe(false);
    });

    it('deve invalidar CNPJ com caracteres não numéricos', () => {
      expect(validateCNPJ('1122233300018a')).toBe(false);
    });

    it('deve lidar com CNPJ formatado', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    });
  });

  describe('Integração dos geradores', () => {
    it('deve gerar documentos com formatos consistentes', () => {
      const cpf = generateCPF();
      const cnpj = generateCNPJ();
      const rg = generateRG();

      expect(formatCPF(cpf)).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
      expect(formatCNPJ(cnpj)).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
      expect(formatRG(rg)).toMatch(/^\d{2}\.\d{3}\.\d{3}-[0-9X]$/);
    });

    it('deve manter consistência entre geração e validação', () => {
      for (let i = 0; i < 5; i++) {
        const cpf = generateCPF();
        const cnpj = generateCNPJ();

        expect(validateCPF(cpf)).toBe(true);
        expect(validateCNPJ(cnpj)).toBe(true);
      }
    });
  });
});
