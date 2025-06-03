/**
 * Hook customizado para geração de dados para testes de QA
 * @author KQA Team
 * @description Hook refatorado que utiliza geradores especializados modulares
 */

import { useState, useEffect } from 'react';
import { fakerPT_BR as faker } from '@faker-js/faker';

// Importações dos geradores especializados
import { formatarCPF, formatarCNPJ, formatarRG } from '../utils/formatters';
import { gerarPessoaSimples } from '../generators/personData';
import { gerarCartaoCredito } from '../generators/creditCard';
import { gerarCEPValido } from '../generators/address';
import { gerarTextoAleatorio, gerarCategoriasUnicas } from '../generators/text';
import {
  generateCPF as gerarCPF,
  generateCNPJ as gerarCNPJ,
  generateRG as gerarRG,
} from '../generators/documents';
import { getEredeTestCardStatuses } from '../generators/eredeTestCards';

// Importações das constantes centralizadas
import {
  PRODUTOS_TECNOLOGIA,
  DESCRICOES_PRODUTOS_TECNOLOGIA,
} from '../constants';

/**
 * Hook principal para geração de dados de teste
 * @returns {Object} Objeto com funções de geração e estado do hook
 */
export const useDataGenerator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicialização do hook
  useEffect(() => {
    try {
      setIsLoading(false);
    } catch (err) {
      setError('Erro ao inicializar o gerador de dados');
      console.error('Erro ao inicializar faker:', err);
    }
  }, []);

  // ============================================================================
  // GERADORES DE DOCUMENTOS
  // ============================================================================

  /**
   * Gera CPF válido com formatação
   * @returns {Object} Objeto com CPF raw e formatado
   */
  const generateCPF = () => {
    const raw = gerarCPF();
    return {
      raw,
      formatted: formatarCPF(raw),
    };
  };

  /**
   * Gera CNPJ válido com formatação
   * @returns {Object} Objeto com CNPJ raw e formatado
   */
  const generateCNPJ = () => {
    const raw = gerarCNPJ();
    return {
      raw,
      formatted: formatarCNPJ(raw),
    };
  };

  /**
   * Gera RG válido com formatação
   * @returns {Object} Objeto com RG raw e formatado
   */
  const generateRG = () => {
    const raw = gerarRG();
    return {
      raw,
      formatted: formatarRG(raw),
    };
  };

  // ============================================================================
  // GERADORES DE DADOS PESSOAIS
  // ============================================================================

  /**
   * Gera pessoa completa com dados pessoais e endereço
   * @returns {Object} Objeto com dados completos da pessoa
   */
  const generatePerson = () => {
    return gerarPessoaSimples();
  };

  // ============================================================================
  // GERADORES DE CARTÃO DE CRÉDITO
  // ============================================================================

  /**
   * Gera cartão de crédito completo
   * @param {string} [bandeira=""] - Bandeira específica (opcional)
   * @param {string} [tipo=""] - Tipo específico (opcional)
   * @param {string} [eredeStatus=""] - Status para cartões Erede (opcional)
   * @returns {Object} Objeto com dados completos do cartão
   */
  const generateCreditCard = (bandeira = '', tipo = '', eredeStatus = '') => {
    return gerarCartaoCredito(bandeira, tipo, eredeStatus);
  };

  // ============================================================================
  // GERADORES DE PRODUTOS
  // ============================================================================

  /**
   * Gera produto tecnológico com descrição e categorias
   * @returns {Object} Objeto com dados do produto
   */
  const generateProduct = () => ({
    nome: faker.helpers.arrayElement(PRODUTOS_TECNOLOGIA),
    descricao: faker.helpers.arrayElement(DESCRICOES_PRODUTOS_TECNOLOGIA),
    categorias: gerarCategoriasUnicas(3),
  });

  // ============================================================================
  // GERADORES DE TEXTO
  // ============================================================================

  /**
   * Gera texto aleatório com tamanho específico
   * @param {number} length - Tamanho desejado do texto
   * @returns {string} Texto gerado com tamanho exato
   */
  const generateRandomChars = length => {
    return gerarTextoAleatorio(length);
  };

  // ============================================================================
  // INTERFACE PÚBLICA DO HOOK
  // ============================================================================

  return {
    // Estado do hook
    isLoading,
    error,

    // Geradores de documentos
    generateCPF,
    generateCNPJ,
    generateRG,

    // Geradores de dados pessoais
    generatePerson,

    // Geradores de cartão de crédito
    generateCreditCard,

    // Geradores de produtos
    generateProduct,

    // Geradores de texto
    generateRandomChars,

    // Utilitários específicos
    gerarCEPValido,
    getEredeTestCardStatuses,
  };
};
