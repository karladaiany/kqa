/**
 * Hook para gerenciamento de documentos (CPF, CNPJ, RG)
 * @author KQA Team
 * @description Extrai lógica de documentos mantendo comportamento original idêntico
 */

import { useState, useCallback } from 'react';
import { useDataGenerator } from './useDataGenerator';

/**
 * Hook para gerenciar documentos
 * Mantém comportamento idêntico ao código original do DataGenerator
 */
export const useDocuments = () => {
  const { generateCPF, generateCNPJ, generateRG } = useDataGenerator();

  // Estado idêntico ao original
  const [documents, setDocuments] = useState({
    cpf: generateCPF(),
    cnpj: generateCNPJ(),
    rg: generateRG(),
  });

  // Funções idênticas ao original do DataGenerator
  const regenerateCPF = useCallback(() => {
    setDocuments(prev => ({
      ...prev,
      cpf: generateCPF(),
    }));
  }, [generateCPF]);

  const regenerateCNPJ = useCallback(() => {
    setDocuments(prev => ({
      ...prev,
      cnpj: generateCNPJ(),
    }));
  }, [generateCNPJ]);

  const regenerateRG = useCallback(() => {
    setDocuments(prev => ({
      ...prev,
      rg: generateRG(),
    }));
  }, [generateRG]);

  return {
    documents,
    regenerateCPF,
    regenerateCNPJ,
    regenerateRG,
  };
};
