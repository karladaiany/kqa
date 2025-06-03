/**
 * Hook para gerenciamento de máscaras de documentos
 * @author KQA Team
 * @description Extrai lógica de máscaras mantendo comportamento original idêntico
 */

import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar máscaras de documentos (CPF, CNPJ, RG)
 * Mantém comportamento idêntico ao código original do DataGenerator
 */
export const useDocumentMasks = () => {
  // Estado idêntico ao original
  const [masks, setMasks] = useState(() => {
    const savedMasks = localStorage.getItem('document-masks');
    return savedMasks
      ? JSON.parse(savedMasks)
      : {
          cpf: true,
          cnpj: true,
          rg: true,
        };
  });

  // Função idêntica ao original do DataGenerator
  const toggleMask = useCallback(field => {
    setMasks(prev => {
      const newMasks = {
        ...prev,
        [field]: !prev[field],
      };
      localStorage.setItem('document-masks', JSON.stringify(newMasks));
      return newMasks;
    });
  }, []);

  return {
    masks,
    toggleMask,
  };
};
